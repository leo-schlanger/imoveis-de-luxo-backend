import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import Advertisement from '../infra/typeorm/entities/Advertisement';
import IAdvertisementsRepository from '../repositories/IAdvertisementsRepository';

interface IRequest {
  advertisement_id: string;
}

@injectable()
class ShowAdvertisementService {
  constructor(
    @inject('AdvertisementsRepository')
    private advertisementsRepository: IAdvertisementsRepository,
  ) {}

  public async execute({ advertisement_id }: IRequest): Promise<Advertisement> {
    const user = await this.advertisementsRepository.findById(advertisement_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    return user;
  }
}

export default ShowAdvertisementService;
