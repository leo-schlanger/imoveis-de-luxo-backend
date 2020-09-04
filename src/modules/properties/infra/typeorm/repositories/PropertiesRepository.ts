import { getRepository, Repository } from 'typeorm';

import IPropertiesRepository from '@modules/properties/repositories/IPropertiesRepository';
import IFindByAddressDTO from '@modules/properties/dtos/IFindByAddressDTO';
import ICreatePropertyDTO from '@modules/properties/dtos/ICreatePropertyDTO';
import Property, { PropertyTypeEnum } from '../entities/Property';

class PropertiesRepository implements IPropertiesRepository {
  private ormRepository: Repository<Property>;

  constructor() {
    this.ormRepository = getRepository(Property);
  }

  public async show(): Promise<Property[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<Property | undefined> {
    const findProperty = await this.ormRepository.findOne(id);

    return findProperty;
  }

  public async findByAddress({
    country,
    state,
    postal_code,
    neighborhood,
    street,
  }: IFindByAddressDTO): Promise<Property | undefined> {
    const findProperty = await this.ormRepository.findOne({
      where: {
        address: {
          country,
          state,
          postal_code,
          neighborhood,
          street,
        },
      },
    });

    return findProperty;
  }

  public async filterByType(
    type: PropertyTypeEnum,
  ): Promise<Property[] | undefined> {
    const findProperty = await this.ormRepository.find({
      where: { type },
    });

    return findProperty;
  }

  public async create({
    type,
    value,
    address,
  }: ICreatePropertyDTO): Promise<Property> {
    const property = this.ormRepository.create({
      address_id: address.id,
      type,
      value,
      address,
    });

    await this.ormRepository.save(property);

    return property;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(property: Property): Promise<Property> {
    return this.ormRepository.save(property);
  }
}

export default PropertiesRepository;
