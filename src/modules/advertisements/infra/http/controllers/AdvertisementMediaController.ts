import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateAdvertisementMediaService from '@modules/advertisements/services/UpdateAdvertisementMediaService';
import { MediaTypeEnum } from '../../typeorm/entities/Media';

interface IMulterRequest {
  files: Express.Multer.File[];
}

export default class AdvertisementMediaController {
  public async update(request: Request, response: Response): Promise<Response> {
    try {
      const { advertisement_id, type } = request.params;
      const user_id = request.user.id;
      const { files } = request as IMulterRequest;

      const gallery = files.map(file => {
        return file.filename;
      });

      const updateAdvertisementMedia = container.resolve(
        UpdateAdvertisementMediaService,
      );

      const advertisement = await updateAdvertisementMedia.execute({
        user_id,
        advertisement_id,
        type: type as MediaTypeEnum,
        gallery,
      });

      return response.json(classToClass(advertisement));
    } catch (err) {
      return response.status(400).json('Upload media error');
    }
  }
}
