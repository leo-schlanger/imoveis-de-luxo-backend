import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import CreatePlanService from '@modules/users/services/plans/CreatePlanService';
import UpdatePlanService from '@modules/users/services/plans/UpdatePlanService';
import DeletePlanService from '@modules/users/services/plans/DeletePlanService';
import ShowPlansService from '@modules/users/services/plans/ShowPlansService';

// TODO: ajustar a autorização do usuário nos serviços e retirar do controle
export default class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const showPlans = container.resolve(ShowPlansService);

    const plans = await showPlans.execute();

    return response.json(plans);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_type = request.user.type;

    if (user_type !== 'adm') {
      throw new AppError('Unauthorized user.', 400);
    }

    const {
      name,
      description,
      quantity_photos,
      quantity_properties,
      quantity_videos,
      value,
    } = request.body;

    const createPlan = container.resolve(CreatePlanService);

    const plan = await createPlan.execute({
      name,
      quantity_photos,
      quantity_properties,
      quantity_videos,
      value,
      description,
    });

    return response.json(plan);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const user_type = request.user.type;

    if (user_type !== 'adm') {
      throw new AppError('Unauthorized user.', 400);
    }

    const { plan_id } = request.params;

    const {
      name,
      quantity_photos,
      quantity_properties,
      quantity_videos,
      value,
      description,
    } = request.body;

    const updatePlan = container.resolve(UpdatePlanService);

    const plan = await updatePlan.execute({
      plan_id,
      name,
      quantity_photos,
      quantity_properties,
      quantity_videos,
      value,
      description,
    });

    return response.json(plan);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const user_type = request.user.type;

    if (user_type !== 'adm') {
      throw new AppError('Unauthorized user.', 400);
    }

    const { plan_id } = request.params;

    const deletePlan = container.resolve(DeletePlanService);

    await deletePlan.execute({ plan_id });

    return response.status(204).json();
  }
}
