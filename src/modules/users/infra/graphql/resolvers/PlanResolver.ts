import { Resolver, Mutation, Arg, Query, UseMiddleware } from 'type-graphql';

import { isAuth } from '@shared/infra/graphql/middlewares/IsAuth';
import { container } from 'tsyringe';

import CreatePlanService from '@modules/users/services/plans/CreatePlanService';
import UpdatePlanService from '@modules/users/services/plans/UpdatePlanService';
import DeletePlanService from '@modules/users/services/plans/DeletePlanService';
import ShowPlanService from '@modules/users/services/plans/ShowPlansService';

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
    const createPlan = container.resolve(CreatePlanService);
    const plan = await createPlan.execute(data);
    return plan;
  }

  @Mutation(() => Plan)
  @UseMiddleware(isAuth)
  async updatePlan(
    @Arg('id', () => String) id: string,
    @Arg('data', () => PlanUpdateInput) data: PlanUpdateInput,
  ): Promise<Plan | undefined> {
    const updatePlan = container.resolve(UpdatePlanService);
    const updatedPlan = await updatePlan.execute({ plan_id: id, ...data });
    return updatedPlan;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePlan(@Arg('id', () => String) id: string): Promise<boolean> {
    const deletePlan = container.resolve(DeletePlanService);
    await deletePlan.execute({ plan_id: id });
    return true;
  }

  @Query(() => [Plan])
  plans(): Promise<Plan[]> {
    const showPlans = container.resolve(ShowPlanService);
    return showPlans.execute();
  }
}
