import { UserStatusEnum, UserTypeEnum } from '../infra/typeorm/entities/User';

export default interface IFindAllUsersDTO {
  except_user_id?: string;
  per_page?: number;
  page?: number;
  filter?: {
    name?: string;
    responsible?: string;
    creci?: string;
    email?: string;
    status?: UserStatusEnum;
    type?: UserTypeEnum;
    address?: {
      country?: string;
      state?: string;
      neighborhood?: string;
      address?: string;
    };
    plan: {
      name?: string;
    };
    plan_status?: boolean;
  };
}
