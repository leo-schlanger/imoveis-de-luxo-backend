import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import Property, {
  PropertyTypeEnum,
} from '../../infra/typeorm/entities/Property';
import IPropertiesRepository from '../../repositories/IPropertiesRepository';

interface IRequest {
  type: PropertyTypeEnum;
}

@injectable()
class ListPropertiesByTypeService {
  constructor(
    @inject('PropertiesRepository')
    private propertiesRepository: IPropertiesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ type }: IRequest): Promise<Property[] | undefined> {
    const cacheKey = `properties:${type}`;

    let properties = await this.cacheProvider.recover<Property[] | undefined>(
      cacheKey,
    );

    if (!properties) {
      properties = await this.propertiesRepository.filterByType(type);

      await this.cacheProvider.save(cacheKey, classToClass(properties));
    }

    return classToClass(properties);
  }
}

export default ListPropertiesByTypeService;
