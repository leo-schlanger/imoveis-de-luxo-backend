import { InputType, Field } from 'type-graphql';
import AddressInput from '@modules/adresses/infra/graphql/inputs/AddressInput';
import { UserStatusEnum, UserTypeEnum } from '../../typeorm/entities/User';
import PlanInput from './PlanInput';

@InputType()
export default class UserInput {
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
