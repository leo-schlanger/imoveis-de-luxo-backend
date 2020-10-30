import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPropertiesRepository from '@modules/properties/repositories/IPropertiesRepository';
import { PropertyTypeEnum } from '@modules/properties/infra/typeorm/entities/Property';
import IAdressesRepository from '@modules/adresses/repositories/IAdressesRepository';
import { UserTypeEnum } from '@modules/users/infra/typeorm/entities/User';
import Advertisement, {
  AdvertisementTypeEnum,
} from '../infra/typeorm/entities/Advertisement';
import IAdvertisementsRepository from '../repositories/IAdvertisementsRepository';

interface IRequest {
  user_id: string;
  title: string;
  description?: string;
  address_visible?: boolean;
  status?: boolean;
  type: AdvertisementTypeEnum;
  property: {
    country: string;
    state: string;
    postal_code: string;
    neighborhood: string;
    street: string;
    sub_neighborhood?: string;
    number?: string;
    complement?: string;
    description?: string;
    type: PropertyTypeEnum;
    value: number;
  };
}

@injectable()
class CreateAdvertisementService {
  constructor(
    @inject('AdressesRepository')
    private adressesRepository: IAdressesRepository,

    @inject('UsersRepository')
    private userRepository: IUsersRepository,

    @inject('PropertiesRepository')
    private propertiesRepository: IPropertiesRepository,

    @inject('AdvertisementsRepository')
    private advertisementsRepository: IAdvertisementsRepository,

    // TODO: Implementar limpeza de cache ao criar novo anúncio
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    property,
    ...ad
  }: IRequest): Promise<Advertisement> {
    const { type: propertyTypes, value, ...rest } = property;
    const userAd = await this.userRepository.findById(user_id);

    if (!userAd) {
      throw new AppError('User not found');
    }

    if (userAd.type === UserTypeEnum.USER) {
      throw new AppError('User cannot run ads');
    }

    const findProperty = await this.propertiesRepository.findByAddress(rest);

    if (findProperty) {
      throw new AppError('This Advertisement already exists');
    }

    const address = await this.adressesRepository.create(rest);

    const propertyCreated = await this.propertiesRepository.create({
      address,
      type: propertyTypes,
      value,
    });

    const advertisement = await this.advertisementsRepository.create({
      property_id: propertyCreated.id,
      user_id,
      ...ad,
    });

    return advertisement;
  }
}

export default CreateAdvertisementService;
