import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileAddressService from '@modules/users/services/users/UpdateProfileAddressService';

export default class UserAddressController {
  public async update(request: Request, response: Response): Promise<Response> {
    const updateProfileAddress = container.resolve(UpdateProfileAddressService);

    const user = await updateProfileAddress.execute({
      user_id: request.user.id,
      ...request.body,
    });

    return response.json(classToClass(user));
  }
}
