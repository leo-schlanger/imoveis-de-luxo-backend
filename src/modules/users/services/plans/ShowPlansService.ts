import { injectable, inject } from 'tsyringe';

import Plan from '../../infra/typeorm/entities/Plan';
import IPlansRepository from '../../repositories/IPlansRepository';

@injectable()
class ShowPlanService {
  constructor(
    @inject('PlansRepository')
    private plansRepository: IPlansRepository,
  ) {}

  public async execute(): Promise<Plan[]> {
    const plans = await this.plansRepository.show();

    return plans;
  }
}

export default ShowPlanService;
