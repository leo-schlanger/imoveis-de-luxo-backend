/* eslint-disable no-param-reassign */
import {
  Resolver,
  Mutation,
  Arg,
  // Ctx
} from 'type-graphql';

import AuthenticateUserService from '@modules/users/services/auth/AuthenticateUserService';
import { container } from 'tsyringe';

@Resolver()
export default class SessionResolver {
  @Mutation(() => String)
  async login(
    @Arg('email', () => String) email: string,
    @Arg('password', () => String) password: string,
    // @Ctx() { req }: MyContext,
  ): Promise<string> {
    const authenticate = container.resolve(AuthenticateUserService);

    const { token } = await authenticate.execute({ email, password });

    return token;
  }
}
