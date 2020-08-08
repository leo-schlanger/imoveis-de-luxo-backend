import {
  Resolver,
  Mutation,
  Arg,
  Query,
  // Ctx
} from 'type-graphql';

// import MyContext from '@shared/infra/graphql/types/MyContext';
import Address from '@modules/adresses/infra/typeorm/entities/Address';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/users/CreateUserService';
import ListUsersService from '@modules/users/services/users/ListUsersService';
import User from '../../typeorm/entities/User';
import UserInput from '../inputs/UserInput';
import UserUpdateInput from '../inputs/UserUpdateInput';
import Plan from '../../typeorm/entities/Plan';
import UserListInput from '../inputs/UserListInput';

@Resolver()
export default class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg('data', () => UserInput) data: UserInput,
  ): Promise<User> {
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute(data);

    return user;
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
  async users(
    @Arg('data', () => UserListInput) data: UserListInput,
  ): Promise<User[]> {
    const listUsers = container.resolve(ListUsersService);

    const usersList = await listUsers.execute(data);

    return usersList;
  }
}
