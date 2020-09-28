import { uuid } from 'uuidv4';

import IExtraFieldsRepository from '@modules/properties/repositories/IExtraFieldsRepository';
import ICreateExtraFieldDTO from '@modules/properties/dtos/ICreateExtraFieldDTO';

import { PropertyTypeEnum } from '@modules/properties/infra/typeorm/entities/Property';
import ExtraField, {
  ExtraFieldTypeEnum,
} from '../../infra/typeorm/entities/ExtraField';

class FakeExtraFieldsRepository implements IExtraFieldsRepository {
  private extraFields: ExtraField[] = [];

  public async show(): Promise<ExtraField[]> {
    return this.extraFields;
  }

  public async findById(id: string): Promise<ExtraField | undefined> {
    const findExtraField = this.extraFields.find(
      extraField => extraField.id === id,
    );

    return findExtraField;
  }

  public async filterByType(
    type: ExtraFieldTypeEnum,
  ): Promise<ExtraField[] | undefined> {
    const listExtraField = this.extraFields.filter(
      extraField => extraField.type === type,
    );

    return listExtraField;
  }

  public async filterByPropertyType(
    type: PropertyTypeEnum,
  ): Promise<ExtraField[] | undefined> {
    const listExtraField = this.extraFields.filter(extraField =>
      extraField.propertyTypes.includes(type),
    );

    return listExtraField;
  }

  public async create({
    name,
    type,
    propertyTypes,
  }: ICreateExtraFieldDTO): Promise<ExtraField> {
    const extraField = new ExtraField();

    Object.assign(extraField, { id: uuid() }, { name, type, propertyTypes });

    this.extraFields.push(extraField);

    return extraField;
  }

  public async delete(id: string): Promise<void> {
    const newList = this.extraFields.filter(ExtraField => ExtraField.id !== id);

    this.extraFields = newList;
  }

  public async save(ExtraField: ExtraField): Promise<ExtraField> {
    const findIndex = this.extraFields.findIndex(
      findExtraField => findExtraField.id === ExtraField.id,
    );

    this.extraFields[findIndex] = ExtraField;

    return ExtraField;
  }
}

export default FakeExtraFieldsRepository;
