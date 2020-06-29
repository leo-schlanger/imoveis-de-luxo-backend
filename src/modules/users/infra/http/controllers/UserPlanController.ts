import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateUserPlanService from '@modules/users/services/users/UpdateUserPlanService';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { plan_id } = request.params;

    const updateUserAvatar = container.resolve(UpdateUserPlanService);

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      plan_id,
    });

    return response.json(classToClass(user));
  }
}
