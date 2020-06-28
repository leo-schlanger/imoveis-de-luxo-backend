import ICreatePlanDTO from '@modules/users/dtos/ICreatePlanDTO';
import Plan from '../infra/typeorm/entities/Plan';

export default interface IPlansRepository {
  show(): Promise<Plan[]>;
  findById(id: string): Promise<Plan | undefined>;
  create(data: ICreatePlanDTO): Promise<Plan>;
  save(plan: Plan): Promise<Plan>;
  delete(id: string): Promise<void>;
}
