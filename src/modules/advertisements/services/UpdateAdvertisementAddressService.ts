import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import IAdressesRepository from '@modules/adresses/repositories/IAdressesRepository';

import { UserTypeEnum } from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import Advertisement from '../infra/typeorm/entities/Advertisement';
import IAdvertisementsRepository from '../repositories/IAdvertisementsRepository';

interface IRequest {
  user_id: string;
  advertisement_id: number;
  country?: string;
  state?: string;
  postal_code?: string;
  neighborhood?: string;
  sub_neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
  description?: string;
}

@injectable()
class UpdateAdvertisementAddressService {
  constructor(
    @inject('AdvertisementsRepository')
    private advertisementsRepository: IAdvertisementsRepository,

    @inject('AdressesRepository')
    private adressesRepository: IAdressesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    user_id,
    advertisement_id,
    ...rest
  }: IRequest): Promise<Advertisement> {
    const advertisement = await this.advertisementsRepository.findById(
      advertisement_id,
    );

    if (!advertisement) {
      throw new AppError('Advertisement not found.');
    }

    if (advertisement.user_id !== user_id) {
      const user = await this.usersRepository.findById(user_id);
      if (!user || user.type !== UserTypeEnum.ADM)
        throw new AppError(`${user?.type}`, 401);
    }

    const address = await this.adressesRepository.findById(
      advertisement.property.address_id,
    );

    if (!address) {
      throw new AppError('Address not found');
    }

    Object.assign(address, rest);

    await this.adressesRepository.save(address);
    advertisement.property.address = address;

    return this.advertisementsRepository.save(advertisement);
  }
}

export default UpdateAdvertisementAddressService;
