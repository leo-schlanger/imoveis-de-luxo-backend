/* eslint-disable no-param-reassign */
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  // Ctx
} from 'type-graphql';
import { compare } from 'bcryptjs';

import uploadConfig from '@config/upload';
import authConfig from '@config/auth';

import { sign } from 'jsonwebtoken';
// import MyContext from '@shared/infra/graphql/types/MyContext';
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

  @Mutation(() => String)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    // @Ctx() { req }: MyContext,
  ): Promise<string> {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Incorrect email/password combination.');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Incorrect email/password combination.');
    }

    const { secret, expiresIn } = authConfig.jwt;

    const token = sign({}, secret, {
      subject: JSON.stringify({ id: user.id, type: user.type }),
      expiresIn,
    });

    return token;
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
