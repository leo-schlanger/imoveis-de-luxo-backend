/* eslint-disable max-classes-per-file */
import {
  Resolver,
  Mutation,
  Arg,
  Ctx,
  UseMiddleware,
  ObjectType,
  Field,
} from 'type-graphql';

import AuthenticateUserService from '@modules/users/services/auth/AuthenticateUserService';
import { container } from 'tsyringe';
import MyContext from '@shared/infra/graphql/types/MyContext';
import { isAuth } from '@shared/infra/graphql/middlewares/IsAuth';
import { classToClass } from 'class-transformer';
import User from '../../typeorm/entities/User';

@ObjectType('LoginResult')
class LoginResult {
  @Field(() => User)
  user: User;

  @Field()
  token: string;
}

@Resolver()
export default class SessionResolver {
  @Mutation(() => String)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
  ): Promise<LoginResult> {
    const authenticate = container.resolve(AuthenticateUserService);

    const { token, user } = await authenticate.execute({ email, password });

    return { user: classToClass(user), token };
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() context: MyContext): Promise<User> {
    const user = await User.findOne(context.req.user.id);

    if (!user) {
      throw new Error('User not found');
    }

    return classToClass(user);
  }
}
