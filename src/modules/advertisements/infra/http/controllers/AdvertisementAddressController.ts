import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateAdvertisementAddressService from '@modules/advertisements/services/UpdateAdvertisementAddressService';

export default class AdvertisementAddressController {
  public async update(request: Request, response: Response): Promise<Response> {
    const { advertisement_id } = request.params;

    const updateAdvertisementAddress = container.resolve(
      UpdateAdvertisementAddressService,
    );

    const advertisement = await updateAdvertisementAddress.execute({
      advertisement_id,
      ...request.body,
    });

    return response.json(classToClass(advertisement));
  }
}
