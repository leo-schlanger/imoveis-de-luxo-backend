import { injectable, inject } from 'tsyringe';

import User, {
  UserStatusEnum,
  UserTypeEnum,
} from '../../infra/typeorm/entities/User';
import IUsersRepository from '../../repositories/IUsersRepository';

interface IRequest {
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

@injectable()
class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IRequest): Promise<User[]> {
    const users = await this.usersRepository.findAllUsers(data);

    return users;
  }
}

export default ListUsersService;
