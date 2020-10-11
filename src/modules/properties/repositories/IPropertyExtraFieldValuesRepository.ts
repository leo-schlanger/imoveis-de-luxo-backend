import ICreatePropertyExtraFieldValueDTO from '../dtos/ICreatePropertyExtraFieldValueDTO';
import PropertyExtraFieldValue from '../infra/typeorm/entities/PropertyExtraFieldValue';

export default interface IPropertyExtraFieldValuesRepository {
  show(): Promise<PropertyExtraFieldValue[]>;
  findById(id: string): Promise<PropertyExtraFieldValue | undefined>;
  filterByPropertyId(
    propertyId: string,
  ): Promise<PropertyExtraFieldValue[] | undefined>;
  create(
    data: ICreatePropertyExtraFieldValueDTO,
  ): Promise<PropertyExtraFieldValue>;
  delete(id: string): Promise<void>;
  save(
    PropertyExtraFieldValue: PropertyExtraFieldValue,
  ): Promise<PropertyExtraFieldValue>;
}
