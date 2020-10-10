import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';
import IPropertiesRepository from '@modules/properties/repositories/IPropertiesRepository';
import IExtraFieldsRepository from '@modules/properties/repositories/IExtraFieldsRepository';
import { ExtraFieldTypeEnum } from '@modules/properties/infra/typeorm/entities/ExtraField';
import PropertyExtraFieldValue from '../../infra/typeorm/entities/PropertyExtraFieldValue';
import IPropertyExtraFieldValuesRepository from '../../repositories/IPropertyExtraFieldValuesRepository';

interface IRequest {
  property_id: string;
  extra_field_id: string;
  value: string;
}

@injectable()
class CreatePropertyExtraFieldValueService {
  constructor(
    @inject('PropertyExtraFieldValuesRepository')
    private propertyExtraFieldValuesRepository: IPropertyExtraFieldValuesRepository,

    @inject('PropertiesRepository')
    private propertiesRepository: IPropertiesRepository,

    @inject('ExtraFieldsRepository')
    private extraFieldsRepository: IExtraFieldsRepository,

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
    property_id,
    extra_field_id,
    value,
  }: IRequest): Promise<PropertyExtraFieldValue> {
    const checkProperty = await this.propertiesRepository.findById(property_id);

    if (!checkProperty) {
      throw new AppError('Property not found.');
    }

    const checkExtraField = await this.extraFieldsRepository.findById(
      extra_field_id,
    );

    if (!checkExtraField) {
      throw new AppError('Extra Field not found.');
    }

    const checkIsValidField = checkExtraField.propertyTypes.includes(
      checkProperty.type,
    );

    if (!checkIsValidField) {
      throw new AppError('Invalid Extra Field.');
    }

    const checkValidValue = this.isValidValue(checkExtraField.type, value);

    if (!checkValidValue) {
      throw new AppError('Invalid Extra Field.');
    }

    const propertyExtraFieldValue = await this.propertyExtraFieldValuesRepository.create(
      {
        property_id,
        extra_field_id,
        value,
      },
    );

    await this.cacheProvider.invalidate(
      `extra_fields_value_property:${property_id}`,
    );

    return propertyExtraFieldValue;
  }
}

export default CreatePropertyExtraFieldValueService;
