import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import IPlansRepository from '../../repositories/IPlansRepository';

interface IRequest {
  plan_id: string;
}

@injectable()
class DeletePlanService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({ plan_id }: IRequest): Promise<void> {
    const plan = await this.plansRepository.findById(plan_id);

    if (!plan) {
      throw new AppError('Plan not found');
    }

    await this.plansRepository.delete(plan.id);
  }
}

export default DeletePlanService;
