/* eslint-disable no-param-reassign */
import { Resolver, Mutation, Arg, Ctx, UseMiddleware } from 'type-graphql';

import AuthenticateUserService from '@modules/users/services/auth/AuthenticateUserService';
import { container } from 'tsyringe';
import MyContext from '@shared/infra/graphql/types/MyContext';
import { isAuth } from '@shared/infra/graphql/middlewares/IsAuth';
import User from '../../typeorm/entities/User';

@Resolver()
export default class SessionResolver {
  @Mutation(() => String)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
  ): Promise<string> {
    const authenticate = container.resolve(AuthenticateUserService);

    const { token } = await authenticate.execute({ email, password });

    return token;
  }

  @Mutation(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() context: MyContext): Promise<User> {
    const user = await User.findOne(context.req.user.id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }
}
