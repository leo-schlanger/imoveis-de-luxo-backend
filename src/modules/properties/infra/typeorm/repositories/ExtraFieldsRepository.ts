import { getRepository, Repository } from 'typeorm';

import IExtraFieldsRepository from '@modules/properties/repositories/IExtraFieldsRepository';
import ICreateExtraFieldDTO from '@modules/properties/dtos/ICreateExtraFieldDTO';
import ExtraField, { ExtraFieldTypeEnum } from '../entities/ExtraField';
import { PropertyTypeEnum } from '../entities/Property';

class ExtraFieldsRepository implements IExtraFieldsRepository {
  private ormRepository: Repository<ExtraField>;

  constructor() {
    this.ormRepository = getRepository(ExtraField);
  }

  public async show(): Promise<ExtraField[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<ExtraField | undefined> {
    const findExtraField = await this.ormRepository.findOne(id);

    return findExtraField;
  }

  public async filterByType(
    type: ExtraFieldTypeEnum,
  ): Promise<ExtraField[] | undefined> {
    const findExtraField = await this.ormRepository.find({
      where: { type },
    });

    return findExtraField;
  }

  public async filterByPropertyType(
    type: PropertyTypeEnum,
  ): Promise<ExtraField[] | undefined> {
    let findExtraField = await this.ormRepository.find();

    findExtraField = findExtraField.filter(extraField =>
      extraField.propertyTypes.includes(type),
    );

    return findExtraField;
  }

  public async create({
    name,
    type,
    propertyTypes,
  }: ICreateExtraFieldDTO): Promise<ExtraField> {
    const ExtraField = this.ormRepository.create({
      name,
      type,
      propertyTypes,
    });

    await this.ormRepository.save(ExtraField);

    return ExtraField;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(ExtraField: ExtraField): Promise<ExtraField> {
    return this.ormRepository.save(ExtraField);
  }
}

export default ExtraFieldsRepository;
