import { InputType, Field } from 'type-graphql';
import { UserStatusEnum, UserTypeEnum } from '../../typeorm/entities/User';

@InputType()
export default class UserListInput {
  @Field({ nullable: true })
  except_user_id: string;

  @Field({ nullable: true })
  per_page: number;

  @Field({ nullable: true })
  page: number;

  @Field({ nullable: true })
  filter: {
    name?: string;
    responsible?: string;
    creci?: string;
    email?: string;
    status?: UserStatusEnum;
    type?: UserTypeEnum;
    address?: {
      country: string;
      state?: string;
      neighborhood?: string;
      address?: string;
    };
    plan?: {
      name: string;
    };
    plan_status?: boolean;
  };
}
