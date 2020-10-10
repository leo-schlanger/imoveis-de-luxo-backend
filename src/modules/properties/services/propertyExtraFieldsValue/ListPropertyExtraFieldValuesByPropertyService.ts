import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPropertyExtraFieldValuesRepository from '../../repositories/IPropertyExtraFieldValuesRepository';
import PropertyExtraFieldValue from '../../infra/typeorm/entities/PropertyExtraFieldValue';

interface IRequest {
  id: string;
}

@injectable()
class ListPropertyExtraFieldValuesByPropertyService {
  constructor(
    @inject('PropertyExtraFieldValuesRepository')
    private propertyExtraFieldValuesRepository: IPropertyExtraFieldValuesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    id,
  }: IRequest): Promise<PropertyExtraFieldValue[] | undefined> {
    const cacheKey = `extra_fields_value_property:${id}`;

    let list = await this.cacheProvider.recover<
      PropertyExtraFieldValue[] | undefined
    >(cacheKey);

    if (!list) {
      list = await this.propertyExtraFieldValuesRepository.filterByPropertyId(
        id,
      );

      await this.cacheProvider.save(cacheKey, list);
    }

    return list;
  }
}

export default ListPropertyExtraFieldValuesByPropertyService;
