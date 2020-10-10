import { injectable, inject } from 'tsyringe';

// import AppError from '@shared/errors/AppErrors';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import { PropertyTypeEnum } from '../../infra/typeorm/entities/Property';
import ExtraField, {
  ExtraFieldTypeEnum,
} from '../../infra/typeorm/entities/ExtraField';
import IExtraFieldsRepository from '../../repositories/IExtraFieldsRepository';

interface IRequest {
  name: string;
  type: ExtraFieldTypeEnum;
  propertyTypes: PropertyTypeEnum[];
}

@injectable()
class CreateExtraFieldService {
  constructor(
    @inject('ExtraFieldsRepository')
    private extraFieldsRepository: IExtraFieldsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    name,
    type,
    propertyTypes,
  }: IRequest): Promise<ExtraField> {
    const extraField = await this.extraFieldsRepository.create({
      name,
      type,
      propertyTypes,
    });

    extraField.propertyTypes.forEach(async type => {
      await this.cacheProvider.invalidate(`extra_fields:${type}`);
    });

    return extraField;
  }
}

export default CreateExtraFieldService;
