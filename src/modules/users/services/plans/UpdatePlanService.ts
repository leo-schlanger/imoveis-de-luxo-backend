import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import Plan from '../../infra/typeorm/entities/Plan';
import IPlansRepository from '../../repositories/IPlansRepository';

interface IRequest {
  plan_id: string;
  name: string;
  description?: string;
  quantity_properties: number;
  quantity_photos: number;
  quantity_videos: number;
  value: number;
}

@injectable()
class UpdatePlanService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({
    plan_id,
    description,
    ...rest
  }: IRequest): Promise<Plan> {
    const plan = await this.plansRepository.findById(plan_id);

    if (!plan) {
      throw new AppError('Plan not found.');
    }

    if (description) {
      Object.assign(plan, { description });
    }

    Object.assign(plan, rest);

    this.plansRepository.save(plan);

    return plan;
  }
}

export default UpdatePlanService;
