import { uuid } from 'uuidv4';

import IPlansRepository from '@modules/users/repositories/IPlansRepository';
import ICreatePlanDTO from '@modules/users/dtos/ICreatePlanDTO';

import Plan from '../../infra/typeorm/entities/Plan';

class FakePlansRepository implements IPlansRepository {
  private plans: Plan[] = [];

  public async show(): Promise<Plan[]> {
    return this.plans;
  }

  public async findById(id: string): Promise<Plan | undefined> {
    const findPlan = this.plans.find(plan => plan.id === id);

    return findPlan;
  }

  public async create(data: ICreatePlanDTO): Promise<Plan> {
    const plan = new Plan();

    Object.assign(plan, { id: uuid() }, data);

    this.plans.push(plan);

    return plan;
  }

  public async save(plan: Plan): Promise<Plan> {
    const findIndex = this.plans.findIndex(findPlan => findPlan.id === plan.id);

    this.plans[findIndex] = plan;

    return plan;
  }

  public async delete(id: string): Promise<void> {
    const newList = this.plans.filter(plan => plan.id !== id);

    this.plans = newList;
  }
}

export default FakePlansRepository;
