import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/users/CreateUserService';
import ShowUserService from '@modules/users/services/users/ShowUserService';

export default class UsersController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { user_id } = request.params;

    const showUser = container.resolve(ShowUserService);

    const user = await showUser.execute({ user_id });

    return response.json(classToClass(user));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password, phone, type } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({
      name,
      email,
      password,
      phone,
      type,
    });

    return response.json(classToClass(user));
  }
}
