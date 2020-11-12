/* eslint-disable import/prefer-default-export */
import { MiddlewareFn, NextFn, ResolverData } from 'type-graphql';
import MyContext from '../types/MyContext';

export const isAdmin: MiddlewareFn<MyContext> = async (
  { context }: ResolverData<MyContext>,
  next: NextFn,
) => {
  const { user } = context.req;

  if (!user) {
    throw new Error('User is missing');
  }

  if (user.type !== 'adm') {
    throw new Error('User not valid');
  }

  return next();
};
