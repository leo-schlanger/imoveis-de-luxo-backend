import ICreatePropertyDTO from '@modules/properties/dtos/ICreatePropertyDTO';
import IFindByAddressDTO from '@modules/properties/dtos/IFindByAddressDTO';
import Property, { PropertyTypeEnum } from '../infra/typeorm/entities/Property';

export default interface IPropertiesRepository {
  show(): Promise<Property[]>;
  findById(id: string): Promise<Property | undefined>;
  findByAddress(data: IFindByAddressDTO): Promise<Property | undefined>;
  filterByType(type: PropertyTypeEnum): Promise<Property[] | undefined>;
  create(data: ICreatePropertyDTO): Promise<Property>;
  delete(id: string): Promise<void>;
  save(Property: Property): Promise<Property>;
}
