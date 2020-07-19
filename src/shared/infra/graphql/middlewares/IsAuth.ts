/* eslint-disable import/prefer-default-export */
import { verify } from 'jsonwebtoken';
import authConfig from '@config/auth';

import { MiddlewareFn, NextFn, ResolverData } from 'type-graphql';
import MyContext from '../types/MyContext';

interface ITokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

interface ITokenSubjectJsonFormat {
  id: string;
  type: string;
}

export const isAuth: MiddlewareFn<MyContext> = async (
  { context }: ResolverData<MyContext>,
  next: NextFn,
) => {
  const authHeader = context.req.headers.authorization;

  if (!authHeader) {
    throw new Error('JWT token is missing');
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    const { sub } = decoded as ITokenPayload;

    const userInfos: ITokenSubjectJsonFormat = JSON.parse(sub);

    context.req.user = userInfos;

    return next();
  } catch (err) {
    throw new Error('Invalid JWT token');
  }
};
