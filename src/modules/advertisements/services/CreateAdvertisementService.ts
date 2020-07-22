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
  type: AdvertisementTypeEnum;
  property: {
    address: {
      country: string;
      state: string;
      postal_code: string;
      neighborhood: string;
      address: string;
      sub_neighborhood?: string;
      number?: string;
      complement?: string;
      description?: string;
    };
    type: PropertyTypeEnum;
    value: number;
  };
}

@injectable()
class CreateAdvertisementService {
  constructor(
    @inject('UserRepository')
    private userRepository: IUsersRepository,

    @inject('AdressesRepository')
    private adressesRepository: IAdressesRepository,

    @inject('AdvertisementsRepository')
    private advertisementsRepository: IAdvertisementsRepository,

    @inject('PropertiesRepository')
    private propertiesRepository: IPropertiesRepository,

    // TODO: Implementar limpeza de cache ao criar novo anúncio
    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    user_id,
    title,
    description,
    type,
    address_visible,
    property,
  }: IRequest): Promise<Advertisement> {
    const userAd = await this.userRepository.findById(user_id);

    if (!userAd) {
      throw new AppError('User not found');
    }

    if (userAd.type === UserTypeEnum.USER) {
      throw new AppError('User cannot run ads');
    }

    const findProperty = await this.propertiesRepository.findByAddress({
      address: property.address.address,
      postal_code: property.address.postal_code,
      state: property.address.state,
      country: property.address.country,
      neighborhood: property.address.neighborhood,
    });

    if (findProperty) {
      throw new AppError('This Advertisement already exists');
    }

    const address = await this.adressesRepository.create(property.address);

    const propertyCreated = await this.propertiesRepository.create({
      address,
      type: property.type,
      value: property.value,
    });

    const advertisement = await this.advertisementsRepository.create({
      type,
      property_id: propertyCreated.id,
      user_id,
      title,
      address_visible,
      description,
    });

    return advertisement;
  }
}

export default CreateAdvertisementService;
