import { uuid } from 'uuidv4';

import IPropertyExtraFieldValuesRepository from '@modules/properties/repositories/IPropertyExtraFieldValuesRepository';
import ICreatePropertyExtraFieldValueDTO from '@modules/properties/dtos/ICreatePropertyExtraFieldValueDTO';
import PropertyExtraFieldValue from '../../infra/typeorm/entities/PropertyExtraFieldValue';

class PropertyExtraFieldValuesRepository
  implements IPropertyExtraFieldValuesRepository {
  private propertyExtraFieldValues: PropertyExtraFieldValue[] = [];

  public async show(): Promise<PropertyExtraFieldValue[]> {
    return this.propertyExtraFieldValues;
  }

  public async findById(
    id: string,
  ): Promise<PropertyExtraFieldValue | undefined> {
    const findPropertyExtraFieldValue = this.propertyExtraFieldValues.find(
      propertyExtraFieldValue => propertyExtraFieldValue.id === id,
    );

    return findPropertyExtraFieldValue;
  }

  public async filterByPropertyId(
    propertyId: string,
  ): Promise<PropertyExtraFieldValue[] | undefined> {
    const findPropertyExtraFieldValues = this.propertyExtraFieldValues.filter(
      propertyExtraFieldValue =>
        propertyExtraFieldValue.property_id === propertyId,
    );

    return findPropertyExtraFieldValues;
  }

  public async create({
    property_id,
    extra_field_id,
    value,
  }: ICreatePropertyExtraFieldValueDTO): Promise<PropertyExtraFieldValue> {
    const extraField = new PropertyExtraFieldValue();

    Object.assign(
      extraField,
      { id: uuid() },
      { property_id, extra_field_id, value },
    );

    this.propertyExtraFieldValues.push(extraField);

    return extraField;
  }

  public async delete(id: string): Promise<void> {
    const newList = this.propertyExtraFieldValues.filter(
      ExtraField => ExtraField.id !== id,
    );

    this.propertyExtraFieldValues = newList;
  }

  public async save(
    propertyExtraFieldValue: PropertyExtraFieldValue,
  ): Promise<PropertyExtraFieldValue> {
    const findIndex = this.propertyExtraFieldValues.findIndex(
      findExtraField => findExtraField.id === propertyExtraFieldValue.id,
    );

    this.propertyExtraFieldValues[findIndex] = propertyExtraFieldValue;

    return propertyExtraFieldValue;
  }
}

export default PropertyExtraFieldValuesRepository;
