import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import Advertisement from '../infra/typeorm/entities/Advertisement';
import { MediaTypeEnum } from '../infra/typeorm/entities/Media';
import IAdvertisementsRepository from '../repositories/IAdvertisementsRepository';
import IMediaRepository from '../repositories/IMediaRepository';

interface IRequest {
  user_id: string;
  advertisement_id: number;
  type: MediaTypeEnum;
  gallery: string[];
}

@injectable()
class UpdateAdvertisementMediaService {
  constructor(
    @inject('AdvertisementsRepository')
    private advertisementsRepository: IAdvertisementsRepository,

    @inject('MediaRepository')
    private mediaRepository: IMediaRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    advertisement_id,
    type,
    gallery,
  }: IRequest): Promise<Advertisement> {
    const advertisement = await this.advertisementsRepository.findById(
      advertisement_id,
    );

    if (!advertisement) {
      throw new AppError('Advertisement not found');
    }

    if (advertisement.user_id !== user_id) {
      throw new AppError('Unauthorized user', 401);
    }

    if (advertisement.gallery.length > 0) {
      const cleanItens = advertisement.gallery.filter(
        media => media.type === type,
      );

      cleanItens.forEach(async media => {
        advertisement.gallery = advertisement.gallery.filter(
          item => item.id !== media.id,
        );
        await this.storageProvider.deleteFile(media.filename);
        await this.mediaRepository.delete(media.id);
      });
    }

    const mediaList = gallery.map(name => {
      const media = this.mediaRepository.createWithoutSave({
        advertisement_id,
        filename: name,
        type,
      });
      advertisement.gallery.push(media);
      return media;
    });

    mediaList.forEach(async media => {
      await this.storageProvider.saveFile(media.filename);
      await this.mediaRepository.save(media);
    });

    return advertisement;
  }
}

export default UpdateAdvertisementMediaService;
