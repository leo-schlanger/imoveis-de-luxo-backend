import Address from '@modules/adresses/infra/typeorm/entities/Address';
import { PropertyTypeEnum } from '../infra/typeorm/entities/Property';

export default interface ICreatePropertyDTO {
  address: Address;
  type: PropertyTypeEnum;
  value: number;
}
