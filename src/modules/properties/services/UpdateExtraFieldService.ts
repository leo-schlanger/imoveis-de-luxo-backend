import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { PropertyTypeEnum } from '../infra/typeorm/entities/Property';
import ExtraField, {
  ExtraFieldTypeEnum,
} from '../infra/typeorm/entities/ExtraField';
import IExtraFieldsRepository from '../repositories/IExtraFieldsRepository';

interface IRequest {
  id: string;
  name?: string;
  type?: ExtraFieldTypeEnum;
  propertyTypes?: PropertyTypeEnum[];
}

@injectable()
class UpdateExtraFieldService {
  constructor(
    @inject('ExtraFieldsRepository')
    private extraFieldsRepository: IExtraFieldsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    id,
    name,
    type,
    propertyTypes,
  }: IRequest): Promise<ExtraField> {
    const extraField = await this.extraFieldsRepository.findById(id);

    if (!extraField) {
      throw new AppError('Property not found.');
    }

    if (name) {
      extraField.name = name;
    }

    if (type) {
      extraField.type = type;
    }

    if (propertyTypes && propertyTypes.length > 0) {
      extraField.propertyTypes = propertyTypes;
      extraField.propertyTypes.forEach(async type => {
        await this.cacheProvider.invalidate(`extra_fields:${type}`);
      });
    }

    return this.extraFieldsRepository.save(extraField);
  }
}

export default UpdateExtraFieldService;
