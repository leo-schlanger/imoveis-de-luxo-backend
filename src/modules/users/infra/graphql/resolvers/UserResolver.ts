import {
  Resolver,
  Mutation,
  Arg,
  Query,
  // Ctx
} from 'type-graphql';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

// import MyContext from '@shared/infra/graphql/types/MyContext';
import CreateUserService from '@modules/users/services/users/CreateUserService';
import ListUsersService from '@modules/users/services/users/ListUsersService';
import UpdateProfileAddressService from '@modules/users/services/users/UpdateProfileAddressService';
import UpdateUserPlanService from '@modules/users/services/users/UpdateUserPlanService';
import UpdateProfileService from '@modules/users/services/users/UpdateProfileService';
import UpdateUserAvatarService from '@modules/users/services/users/UpdateUserAvatarService';

import UserListInput from '../inputs/UserListInput';
import UserUpdateInput from '../inputs/UserUpdateInput';
import UserInput from '../inputs/UserInput';
import User from '../../typeorm/entities/User';

@Resolver()
export default class UserResolver {
  @Mutation(() => User)
  async createUser(
    @Arg('data', () => UserInput) data: UserInput,
  ): Promise<User> {
    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute(data);

    return classToClass(user);
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => String) id: string,
    @Arg('data', () => UserUpdateInput)
    data: UserUpdateInput,
  ): Promise<User | undefined> {
    const { address, plan_id, avatar, ...rest } = data;

    const updateUserAddress = container.resolve(UpdateProfileAddressService);
    const updateUserPlan = container.resolve(UpdateUserPlanService);
    const updateUserProfile = container.resolve(UpdateProfileService);
    const updateUserAvatar = container.resolve(UpdateUserAvatarService);

    const user = await User.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    let newUser: User;

    if (address) {
      newUser = await updateUserAddress.execute({
        user_id: user.id,
        ...address,
      });
    }

    if (plan_id) {
      newUser = await updateUserPlan.execute({ user_id: user.id, plan_id });
    }

    if (avatar) {
      newUser = await updateUserAvatar.execute({
        user_id: user.id,
        avatarFilename: avatar,
      });
    }

    newUser = await updateUserProfile.execute({ user_id: user.id, ...rest });

    return newUser;
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

    return classToClass(usersList);
  }
}
