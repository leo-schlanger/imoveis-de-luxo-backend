import { Resolver, Mutation, Arg, Query, UseMiddleware } from 'type-graphql';

import { isAuth } from '@shared/infra/graphql/middlewares/IsAuth';
import Plan from '../../typeorm/entities/Plan';
import PlanInput from '../inputs/PlanInput';
import PlanUpdateInput from '../inputs/PlanUpdateInput';

@Resolver()
export default class PlanResolver {
  @Mutation(() => Plan)
  @UseMiddleware(isAuth)
  async createPlan(
    @Arg('data', () => PlanInput) data: PlanInput,
  ): Promise<Plan> {
    const plan = await Plan.create(data).save();
    return plan;
  }

  @Mutation(() => Plan)
  @UseMiddleware(isAuth)
  async updatePlan(
    @Arg('id', () => String) id: string,
    @Arg('data', () => PlanUpdateInput) data: PlanUpdateInput,
  ): Promise<Plan | undefined> {
    await Plan.update({ id }, data);
    return Plan.findOne(id);
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePlan(@Arg('id', () => String) id: string): Promise<boolean> {
    await Plan.delete({ id });
    return true;
  }

  @Query(() => [Plan])
  plans(): Promise<Plan[]> {
    return Plan.find();
  }
}
