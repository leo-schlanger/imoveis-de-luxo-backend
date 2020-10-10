import { getRepository, Repository } from 'typeorm';

import IPropertyExtraFieldValuesRepository from '@modules/properties/repositories/IPropertyExtraFieldValuesRepository';
import ICreatePropertyExtraFieldValueDTO from '@modules/properties/dtos/ICreatePropertyExtraFieldValueDTO';
import PropertyExtraFieldValue from '../entities/PropertyExtraFieldValue';

class PropertyExtraFieldValuesRepository
  implements IPropertyExtraFieldValuesRepository {
  private ormRepository: Repository<PropertyExtraFieldValue>;

  constructor() {
    this.ormRepository = getRepository(PropertyExtraFieldValue);
  }

  public async show(): Promise<PropertyExtraFieldValue[]> {
    return this.ormRepository.find();
  }

  public async findById(
    id: string,
  ): Promise<PropertyExtraFieldValue | undefined> {
    const findExtraField = await this.ormRepository.findOne(id);

    return findExtraField;
  }

  public async filterByPropertyId(
    propertyId: string,
  ): Promise<PropertyExtraFieldValue[] | undefined> {
    const findExtraField = await this.ormRepository.find({
      where: { property_id: propertyId },
    });

    return findExtraField;
  }

  public async create({
    property_id,
    extra_field_id,
    value,
  }: ICreatePropertyExtraFieldValueDTO): Promise<PropertyExtraFieldValue> {
    const ExtraField = this.ormRepository.create({
      property_id,
      extra_field_id,
      value,
    });

    await this.ormRepository.save(ExtraField);

    return ExtraField;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(
    PropertyExtraFieldValue: PropertyExtraFieldValue,
  ): Promise<PropertyExtraFieldValue> {
    return this.ormRepository.save(PropertyExtraFieldValue);
  }
}

export default PropertyExtraFieldValuesRepository;
