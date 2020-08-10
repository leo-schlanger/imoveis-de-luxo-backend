import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import { PropertyTypeEnum } from '@modules/properties/infra/typeorm/entities/Property';
import Advertisement, {
  AdvertisementTypeEnum,
} from '../infra/typeorm/entities/Advertisement';
import IAdvertisementsRepository from '../repositories/IAdvertisementsRepository';

interface IRequest {
  per_page?: number;
  page?: number;
  filter?: {
    type: AdvertisementTypeEnum;
    property?: {
      type: PropertyTypeEnum;
      address?: {
        country?: string;
        state?: string;
        neighborhood?: string;
        address?: string;
      };
    };
  };
}

@injectable()
class ListAdvertisementsService {
  constructor(
    @inject('AdvertisementsRepository')
    private advertisementsRepository: IAdvertisementsRepository,

    // TODO: analisar necessidade de implementação de cache
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(data: IRequest): Promise<[Advertisement[], number]> {
    const results = await this.advertisementsRepository.show(data);

    return [classToClass(results[0]), results[1]];
  }
}

export default ListAdvertisementsService;
