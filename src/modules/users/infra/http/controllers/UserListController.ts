import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListUsersService from '@modules/users/services/users/ListUsersService';

export default class UserListController {
  public async show(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const listUser = container.resolve(ListUsersService);

    const Users = await listUser.execute(data);

    return response.json(classToClass(Users));
  }
}
