import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IAdvertisementsRepository from '../repositories/IAdvertisementsRepository';

interface IRequest {
  user_id: string;
  id: number;
}

@injectable()
class DeleteAdvertisementService {
  constructor(
    @inject('AdvertisementsRepository')
    private advertisementsRepository: IAdvertisementsRepository,

    // TODO: implementar cache de limpeza de lista mais para frente
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ user_id, id }: IRequest): Promise<void> {
    const advertisement = await this.advertisementsRepository.findById(id);

    if (!advertisement) {
      throw new AppError('Advertisement not found');
    }

    if (advertisement.user_id !== user_id) {
      throw new AppError('Unauthorized user', 401);
    }

    // TODO: pode ter limpeza de cache de lista também mais para frente

    await this.advertisementsRepository.delete(advertisement.id);
  }
}

export default DeleteAdvertisementService;
