/* eslint-disable no-param-reassign */
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  // Ctx
} from 'type-graphql';

import uploadConfig from '@config/upload';
// import MyContext from '@shared/infra/graphql/types/MyContext';
import Address from '@modules/adresses/infra/typeorm/entities/Address';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import User from '../../typeorm/entities/User';
import UserInput from '../inputs/UserInput';
import UserUpdateInput from '../inputs/UserUpdateInput';
import Plan from '../../typeorm/entities/Plan';

@Resolver()
export default class UserResolver {
  private hash: IHashProvider;

  constructor() {
    this.hash = new BCryptHashProvider();
  }

  @Mutation(() => User)
  async createUser(
    @Arg('data', () => UserInput) data: UserInput,
  ): Promise<User> {
    const user = User.create(data);

    user.password = await this.hash.generateHash(data.password);

    return user.save();
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UserUpdateInput)
    data: UserUpdateInput,
  ): Promise<User | undefined> {
    const { address, plan_id, ...rest } = data;

    const user = await User.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    if (address) {
      const newAddress = user.address_id
        ? (await Address.update({ id: user.address_id }, user.address)) &&
          (await Address.findOne(user.address_id))
        : await Address.create(user.address).save();

      if (!newAddress) {
        throw new Error('Invalid address params or invalid id');
      }

      Object.assign(user, { address: newAddress, address_id: newAddress.id });
    }

    if (plan_id) {
      const findPlan = await Plan.findOne(plan_id);

      if (!findPlan) {
        throw new Error('Invalid plan id');
      }

      Object.assign(user, { plan: findPlan, plan_id });
    }
    await user.save();

    await User.update({ id }, rest);
    return User.findOne(id);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => String) id: string): Promise<boolean> {
    await User.delete({ id });
    return true;
  }

  @Query(() => [User])
  async users(): Promise<User[]> {
    let usersList = await User.find();

    usersList = usersList.map(user => {
      if (user.avatar) {
        switch (uploadConfig.driver) {
          case 'disk':
            user.avatar = `${process.env.APP_API_URL}/files/${user.avatar}`;
            break;
          case 's3':
            user.avatar = `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${user.avatar}`;
            break;
          default:
            break;
        }
      }
      return user;
    });

    return usersList;
  }
}
