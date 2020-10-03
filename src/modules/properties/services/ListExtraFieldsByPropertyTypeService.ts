import { injectable, inject } from 'tsyringe';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { PropertyTypeEnum } from '../infra/typeorm/entities/Property';
import IExtraFieldsRepository from '../repositories/IExtraFieldsRepository';
import ExtraField from '../infra/typeorm/entities/ExtraField';

interface IRequest {
  type: PropertyTypeEnum;
}

@injectable()
class ListExtraFieldByPropertyTypeService {
  constructor(
    @inject('ExtraFieldsRepository')
    private extraFieldsRepository: IExtraFieldsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ type }: IRequest): Promise<ExtraField[] | undefined> {
    const cacheKey = `extra_fields:${type}`;

    let extraField = await this.cacheProvider.recover<ExtraField[] | undefined>(
      cacheKey,
    );

    if (!extraField) {
      extraField = await this.extraFieldsRepository.filterByPropertyType(type);

      await this.cacheProvider.save(cacheKey, extraField);
    }

    return extraField;
  }
}

export default ListExtraFieldByPropertyTypeService;
