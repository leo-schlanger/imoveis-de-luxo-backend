/* eslint-disable no-param-reassign */
/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable max-classes-per-file */
import { Resolver, Mutation, Arg, Query, InputType, Field } from 'type-graphql';
import uploadConfig from '@config/upload';
import Address from '@modules/adresses/infra/typeorm/entities/Address';
import {
  AddressInput,
  AddressUpdateInput,
} from '@modules/adresses/infra/graphql/resolvers/AddressResolver';
import User, {
  UserStatusEnum,
  UserTypeEnum,
} from '../../typeorm/entities/User';
import Plan from '../../typeorm/entities/Plan';
import { PlanInput, PlanUpdateInput } from './PlanResolver';

@InputType()
class UserInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  responsible: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  creci: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  secondary_phone: string;

  @Field(() => UserStatusEnum)
  status: UserStatusEnum;

  @Field(() => UserTypeEnum)
  type: UserTypeEnum;

  @Field()
  password: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  address_id: string;

  @Field(() => AddressInput, { nullable: true })
  address: AddressInput;

  @Field({ nullable: true })
  plan_id: string;

  @Field(() => PlanInput, { nullable: true })
  plan: PlanInput;

  @Field(() => Boolean)
  plan_status: boolean;
}

@InputType()
class UserUpdateInput {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  responsible: string;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  creci: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  secondary_phone: string;

  @Field(() => UserStatusEnum, { nullable: true })
  status: UserStatusEnum;

  @Field(() => UserTypeEnum, { nullable: true })
  type: UserTypeEnum;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  avatar: string;

  @Field({ nullable: true })
  address_id: string;

  @Field(() => AddressUpdateInput, { nullable: true })
  address: AddressUpdateInput;

  @Field({ nullable: true })
  plan_id: string;

  @Field(() => PlanUpdateInput, { nullable: true })
  plan: PlanUpdateInput;

  @Field(() => Boolean, { nullable: true })
  plan_status: boolean;
}

@Resolver()
export class UserResolver {
  @Mutation(() => User)
  async createUser(@Arg('options', () => UserInput) options: UserInput) {
    const user = await User.create(options).save();

    return user;
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id', () => String) id: string,
    @Arg('input', () => UserUpdateInput) input: UserUpdateInput,
  ) {
    await User.update({ id }, input);
    return User.findOne(id);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Arg('id', () => String) id: string) {
    await User.delete({ id });
    return true;
  }

  @Query(() => [User])
  async users() {
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
