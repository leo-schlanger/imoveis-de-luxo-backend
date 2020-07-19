/* eslint-disable no-param-reassign */
import { Resolver, Mutation, Arg, Query } from 'type-graphql';
import uploadConfig from '@config/upload';

import User from '../../typeorm/entities/User';
import UserInput from '../inputs/UserInput';
import UserUpdateInput from '../inputs/UserUpdateInput';

@Resolver()
export default class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg('data', () => UserInput) data: UserInput,
  ): Promise<User> {
    const user = await User.create(data).save();

    return user;
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UserUpdateInput) data: UserUpdateInput,
  ): Promise<User | undefined> {
    await User.update({ id }, data);
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
