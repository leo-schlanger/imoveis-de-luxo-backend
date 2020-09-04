import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import IAdressesRepository from '@modules/adresses/repositories/IAdressesRepository';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Property, { PropertyTypeEnum } from '../infra/typeorm/entities/Property';
import IPropertiesRepository from '../repositories/IPropertiesRepository';

interface IRequest {
  property_id: string;
  country?: string;
  state?: string;
  postal_code?: string;
  neighborhood?: string;
  sub_neighborhood?: string;
  street?: string;
  number?: string;
  complement?: string;
  description?: string;
  type: PropertyTypeEnum;
  value: number;
}

@injectable()
class UpdatePropertyService {
  constructor(
    @inject('PropertiesRepository')
    private propertiesRepository: IPropertiesRepository,

    @inject('AdressesRepository')
    private adressesRepository: IAdressesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    property_id,
    value,
    type,
    ...rest
  }: IRequest): Promise<Property> {
    const property = await this.propertiesRepository.findById(property_id);

    if (!property) {
      throw new AppError('Property not found.');
    }

    if (property.type !== type) {
      await this.cacheProvider.invalidate(`properties:${property.type}`);
      await this.cacheProvider.invalidate(`properties:${type}`);

      property.type = type;
    }

    property.value = value;

    const address = await this.adressesRepository.findById(property.address_id);

    if (!address) {
      throw new AppError('Address not found');
    }

    Object.assign(address, rest);

    await this.adressesRepository.save(address);
    property.address = address;

    return this.propertiesRepository.save(property);
  }
}

export default UpdatePropertyService;
