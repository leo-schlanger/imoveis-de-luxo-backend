import { getRepository, Repository } from 'typeorm';

import IPlansRepository from '@modules/users/repositories/IPlansRepository';
import ICreatePlanDTO from '@modules/users/dtos/ICreatePlanDTO';

import Plan from '../entities/Plan';

class PlansRepository implements IPlansRepository {
  private ormRepository: Repository<Plan>;

  constructor() {
    this.ormRepository = getRepository(Plan);
  }

  public async show(): Promise<Plan[]> {
    const plans = await this.ormRepository.find();

    return plans;
  }

  public async findById(id: string): Promise<Plan | undefined> {
    const findPlan = await this.ormRepository.findOne(id);

    return findPlan;
  }

  public async create(data: ICreatePlanDTO): Promise<Plan> {
    const plan = this.ormRepository.create(data);

    await this.ormRepository.save(plan);

    return plan;
  }

  public async save(plan: Plan): Promise<Plan> {
    return this.ormRepository.save(plan);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }
}

export default PlansRepository;
