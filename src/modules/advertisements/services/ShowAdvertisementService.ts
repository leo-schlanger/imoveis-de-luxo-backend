import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import Advertisement from '../infra/typeorm/entities/Advertisement';
import IAdvertisementsRepository from '../repositories/IAdvertisementsRepository';

interface IRequest {
  advertisement_id: number;
}

@injectable()
class ShowAdvertisementService {
  constructor(
    @inject('AdvertisementsRepository')
    private advertisementsRepository: IAdvertisementsRepository,
  ) {}

  public async execute({ advertisement_id }: IRequest): Promise<Advertisement> {
    const advertisement = await this.advertisementsRepository.findById(
      advertisement_id,
    );

    if (!advertisement) {
      throw new AppError('Advertisement not found.');
    }

    return advertisement;
  }
}

export default ShowAdvertisementService;
