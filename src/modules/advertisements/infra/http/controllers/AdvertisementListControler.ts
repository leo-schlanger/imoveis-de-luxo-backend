import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListAdvertisementsService from '@modules/advertisements/services/ListAdvertisementsService';

export default class AdvertisementListController {
  public async show(request: Request, response: Response): Promise<Response> {
    const data = request.body;

    const listAdvertisement = container.resolve(ListAdvertisementsService);

    const advertisements = await listAdvertisement.execute(data);

    return response.json(classToClass(advertisements));
  }
}
