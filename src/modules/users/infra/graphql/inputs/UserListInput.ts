/* eslint-disable max-classes-per-file */
import { InputType, Field, Int } from 'type-graphql';
import { UserStatusEnum, UserTypeEnum } from '../../typeorm/entities/User';

@InputType()
class UserAddress {
  @Field({ nullable: true })
  country: string;

  @Field({ nullable: true })
  state: string;

  @Field({ nullable: true })
  neighborhood: string;

  @Field({ nullable: true })
  address: string;
}

@InputType()
class UserPlan {
  @Field({ nullable: true })
  name: string;
}

@InputType()
class UserFilter {
  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  responsible: string;

  @Field({ nullable: true })
  creci: string;

  @Field({ nullable: true })
  email: string;

  @Field(() => UserStatusEnum, { nullable: true })
  status: UserStatusEnum;

  @Field(() => UserTypeEnum, { nullable: true })
  type: UserTypeEnum;

  @Field({ nullable: true })
  address: UserAddress;

  @Field({ nullable: true })
  plan: UserPlan;

  @Field({ nullable: true })
  plan_status: boolean;
}

@InputType()
export default class UserListInput {
  @Field({ nullable: true })
  except_user_id: string;

  @Field(() => Int, { nullable: true })
  per_page: number;

  @Field(() => Int, { nullable: true })
  page: number;

  @Field({ nullable: true })
  filter: UserFilter;
}
