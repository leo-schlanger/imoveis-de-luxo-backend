/* eslint-disable no-param-reassign */
import {
  Resolver,
  Mutation,
  Arg,
  // Ctx
} from 'type-graphql';
// import { compare } from 'bcryptjs';

import authConfig from '@config/auth';

import { sign } from 'jsonwebtoken';
// import MyContext from '@shared/infra/graphql/types/MyContext';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import BCryptHashProvider from '@modules/users/providers/HashProvider/implementations/BCryptHashProvider';
import User from '../../typeorm/entities/User';

@Resolver()
export default class SessionResolver {
  private hash: IHashProvider;

  constructor() {
    this.hash = new BCryptHashProvider();
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

    const passwordMatched = await this.hash.compareHash(
      password,
      user.password,
    );

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
}
