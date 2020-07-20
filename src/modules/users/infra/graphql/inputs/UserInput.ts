import { InputType, Field } from 'type-graphql';
import { UserStatusEnum, UserTypeEnum } from '../../typeorm/entities/User';

@InputType()
export default class UserInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field(() => UserStatusEnum, { nullable: true })
  status: UserStatusEnum;

  @Field(() => UserTypeEnum)
  type: UserTypeEnum;

  @Field()
  password: string;
}
