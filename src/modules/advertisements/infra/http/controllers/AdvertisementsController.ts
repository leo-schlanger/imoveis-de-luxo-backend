import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateAdvertisementService from '@modules/advertisements/services/CreateAdvertisementService';
import ShowAdvertisementService from '@modules/advertisements/services/ShowAdvertisementService';
import UpdateAdvertisementService from '@modules/advertisements/services/UpdateAdvertisementService';
import DeleteAdvertisementService from '@modules/advertisements/services/DeleteAdvertisementService';

export default class AdvertisementsController {
  public async show(request: Request, response: Response): Promise<Response> {
    const { advertisement_id } = request.params;

    const showAdvertisement = container.resolve(ShowAdvertisementService);

    const advertisement = await showAdvertisement.execute({ advertisement_id });

    return response.json(classToClass(advertisement));
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;
    const {
      title,
      property,
      type,
      address_visible,
      description,
    } = request.body;

    const createAdvertisement = container.resolve(CreateAdvertisementService);

    const advertisement = await createAdvertisement.execute({
      user_id,
      title,
      property,
      type,
      address_visible,
      description,
    });

    return response.json(advertisement);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { advertisement_id } = request.params;
    const { title, type, description, address_visible } = request.body;

    const updateAdvertisement = container.resolve(UpdateAdvertisementService);

    const advertisement = await updateAdvertisement.execute({
      advertisement_id,
      title,
      type,
      description,
      address_visible,
    });

    return response.json(classToClass(advertisement));
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { advertisement_id } = request.params;

    const deleteAdvertisement = container.resolve(DeleteAdvertisementService);

    await deleteAdvertisement.execute({
      id: advertisement_id,
    });

    return response.status(204).json();
  }
}
