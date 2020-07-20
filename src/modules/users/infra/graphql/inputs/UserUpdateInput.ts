import { InputType, Field } from 'type-graphql';
import AddressUpdateInput from '@modules/adresses/infra/graphql/inputs/AddressUpdateInput';
import { UserStatusEnum, UserTypeEnum } from '../../typeorm/entities/User';

@InputType()
export default class UserUpdateInput {
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

  @Field(() => AddressUpdateInput, { nullable: true })
  address: AddressUpdateInput;

  @Field({ nullable: true })
  plan_id: string;

  @Field(() => Boolean, { nullable: true })
  plan_status: boolean;
}
