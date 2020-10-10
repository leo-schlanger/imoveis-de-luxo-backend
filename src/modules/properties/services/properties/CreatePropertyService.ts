import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import IAdressesRepository from '@modules/adresses/repositories/IAdressesRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import Property, {
  PropertyTypeEnum,
} from '../../infra/typeorm/entities/Property';
import IPropertiesRepository from '../../repositories/IPropertiesRepository';

interface IRequest {
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
}

@injectable()
class CreatePropertyService {
  constructor(
    @inject('PropertiesRepository')
    private propertiesRepository: IPropertiesRepository,

    @inject('AdressesRepository')
    private adressesRepository: IAdressesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ type, value, ...rest }: IRequest): Promise<Property> {
    const propertyExists = await this.propertiesRepository.findByAddress(rest);

    if (propertyExists) {
      throw new AppError('This property already exists');
    }

    const address = await this.adressesRepository.create(rest);

    const property = await this.propertiesRepository.create({
      type,
      value,
      address,
    });

    await this.cacheProvider.invalidate(`properties:${property.type}`);

    return property;
  }
}

export default CreatePropertyService;
