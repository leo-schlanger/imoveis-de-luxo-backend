import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import PropertyExtraFieldValue from '@modules/properties/infra/typeorm/entities/PropertyExtraFieldValue';
import { ExtraFieldTypeEnum } from '@modules/properties/infra/typeorm/entities/ExtraField';
import IPropertyExtraFieldValuesRepository from '../../repositories/IPropertyExtraFieldValuesRepository';

interface IRequest {
  id: string;
  value: string;
}

@injectable()
class UpdatePropertyExtraFieldValueService {
  constructor(
    @inject('PropertyExtraFieldValuesRepository')
    private PropertyExtraFieldValuesRepository: IPropertyExtraFieldValuesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  isValidValue(type: ExtraFieldTypeEnum, value: string): boolean {
    // TODO: isolar num utils
    function isNumber(val: string): boolean {
      return /^-?\d+$/.test(val) || /^\d+\.\d+$/.test(val);
    }

    switch (type) {
      case ExtraFieldTypeEnum.NUMBER:
        return isNumber(value);
      case ExtraFieldTypeEnum.BOOLEAN:
        return value === 'true' || value === 'false';
      default:
        return true;
    }
  }

  public async execute({
    id,
    value,
  }: IRequest): Promise<PropertyExtraFieldValue> {
    const propertyExtraFieldValue = await this.PropertyExtraFieldValuesRepository.findById(
      id,
    );

    if (!propertyExtraFieldValue) {
      throw new AppError('Property not found.');
    }

    const checkValidValue = this.isValidValue(
      propertyExtraFieldValue.extraField.type,
      value,
    );

    if (!checkValidValue) {
      throw new AppError('Invalid Extra Field.');
    }

    propertyExtraFieldValue.value = value;

    await this.cacheProvider.invalidate(
      `extra_fields_value_property:${propertyExtraFieldValue.property_id}`,
    );

    return this.PropertyExtraFieldValuesRepository.save(
      propertyExtraFieldValue,
    );
  }
}

export default UpdatePropertyExtraFieldValueService;
