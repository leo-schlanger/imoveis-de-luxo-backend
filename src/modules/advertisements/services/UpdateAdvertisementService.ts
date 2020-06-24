import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Advertisement, {
  AdvertisementTypeEnum,
} from '../infra/typeorm/entities/Advertisement';
import IAdvertisementsRepository from '../repositories/IAdvertisementsRepository';

interface IRequest {
  advertisement_id: string;
  title?: string;
  description?: string;
  address_visible: boolean;
  type: AdvertisementTypeEnum;
}

@injectable()
class UpdateAdvertisementService {
  constructor(
    @inject('AdvertisementsRepository')
    private advertisementsRepository: IAdvertisementsRepository,

    // TODO: Implementar limpeza de cache ao atualizar novo anúncio
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    advertisement_id,
    title,
    description,
    address_visible,
    type,
  }: IRequest): Promise<Advertisement> {
    const advertisement = await this.advertisementsRepository.findById(
      advertisement_id,
    );

    if (!advertisement) {
      throw new AppError('Advertisement not found.');
    }

    if (advertisement.type !== type) {
      // TODO: implementação de cache aqui
      advertisement.type = type;
    }

    advertisement.address_visible = address_visible;

    if (title) {
      advertisement.title = title;
    }

    if (description) {
      advertisement.description = description;
    }

    return this.advertisementsRepository.save(advertisement);
  }
}

export default UpdateAdvertisementService;
