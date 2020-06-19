import ICreateAddressDTO from '@modules/adresses/dtos/ICreateAddressDTO';
import IFilterAddressDTO from '@modules/adresses/dtos/IFilterAddressDTO';
import Address from '../infra/typeorm/entities/Address';

export default interface IAdressesRepository {
  findById(id: string): Promise<Address | undefined>;
  filter(data: IFilterAddressDTO): Promise<Address[] | undefined>;
  create(data: ICreateAddressDTO): Promise<Address>;
  delete(id: string): Promise<void>;
  save(Address: Address): Promise<Address>;
}
