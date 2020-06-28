import { injectable, inject } from 'tsyringe';

import Plan from '../../infra/typeorm/entities/Plan';
import IPlansRepository from '../../repositories/IPlansRepository';

interface IRequest {
  name: string;
  description?: string;
  quantity_properties: number;
  quantity_photos: number;
  quantity_videos: number;
  value: number;
}

@injectable()
class CreatePlanService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute({
    name,
    description,
    quantity_properties,
    quantity_photos,
    quantity_videos,
    value,
  }: IRequest): Promise<Plan> {
    const plan = await this.plansRepository.create({
      name,
      description,
      quantity_properties,
      quantity_photos,
      quantity_videos,
      value,
    });

    return plan;
  }
}

export default CreatePlanService;
