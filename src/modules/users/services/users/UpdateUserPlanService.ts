import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import User, { UserTypeEnum } from '../../infra/typeorm/entities/User';
import IUsersRepository from '../../repositories/IUsersRepository';
import IPlansRepository from '../../repositories/IPlansRepository';

interface IRequest {
  user_id: string;
  plan_id: string;
}

@injectable()
class UpdateUserPlanService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({ user_id, plan_id }: IRequest): Promise<User> {
    const plan = await this.plansRepository.findById(plan_id);

    if (!plan) {
      throw new AppError('Plan not found');
    }

    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change plan', 401);
    }

    if (user.type !== UserTypeEnum.ADVERTISER) {
      throw new AppError('Only advertiser have plan', 401);
    }

    Object.assign(user, { plan_id, plan_status: true, plan });

    return this.usersRepository.save(user);
  }
}

export default UpdateUserPlanService;
