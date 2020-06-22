import { uuid } from 'uuidv4';

import IPropertiesRepository from '@modules/properties/repositories/IPropertiesRepository';
import ICreatePropertyDTO from '@modules/properties/dtos/ICreatePropertyDTO';
import IFindByAddressDTO from '@modules/properties/dtos/IFindByAddressDTO';

import Property, {
  PropertyTypeEnum,
} from '../../infra/typeorm/entities/Property';

class FakePropertiesRepository implements IPropertiesRepository {
  private properties: Property[] = [];

  public async show(): Promise<Property[]> {
    return this.properties;
  }

  public async findById(id: string): Promise<Property | undefined> {
    const findProperty = this.properties.find(property => property.id === id);

    return findProperty;
  }

  public async findByAddress({
    country,
    state,
    postal_code,
    neighborhood,
    address,
  }: IFindByAddressDTO): Promise<Property | undefined> {
    const findProperty = this.properties.find(property => {
      return (
        property.address.country === country &&
        property.address.state === state &&
        property.address.postal_code === postal_code &&
        property.address.neighborhood === neighborhood &&
        property.address.address === address
      );
    });

    return findProperty;
  }

  public async filterByType(
    type: PropertyTypeEnum,
  ): Promise<Property[] | undefined> {
    const listProperty = this.properties.filter(
      property => property.type === type,
    );

    return listProperty;
  }

  public async create({
    type,
    value,
    address,
  }: ICreatePropertyDTO): Promise<Property> {
    const property = new Property();

    Object.assign(
      property,
      { id: uuid() },
      { address_id: address.id, type, value, address },
    );

    this.properties.push(property);

    return property;
  }

  public async delete(id: string): Promise<void> {
    const newList = this.properties.filter(property => property.id !== id);

    this.properties = newList;
  }

  public async save(property: Property): Promise<Property> {
    const findIndex = this.properties.findIndex(
      findProperty => findProperty.id === property.id,
    );

    this.properties[findIndex] = property;

    return property;
  }
}

export default FakePropertiesRepository;
