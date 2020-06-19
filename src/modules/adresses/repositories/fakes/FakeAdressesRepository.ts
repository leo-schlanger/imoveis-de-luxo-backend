import { uuid } from 'uuidv4';

import IAdressesRepository from '@modules/adresses/repositories/IAdressesRepository';
import ICreateAddressDTO from '@modules/adresses/dtos/ICreateAddressDTO';
import IFilterAddressDTO from '@modules/adresses/dtos/IFilterAddressDTO';

import Address from '../../infra/typeorm/entities/Address';

class FakeAdressesRepository implements IAdressesRepository {
  private adresses: Address[] = [];

  public async findById(id: string): Promise<Address | undefined> {
    const findAddress = this.adresses.find(address => address.id === id);

    return findAddress;
  }

  public async filter(data: IFilterAddressDTO): Promise<Address[] | undefined> {
    const findAddress = this.adresses.filter(address => {
      if (
        (data.country && data.country !== address.country) ||
        (data.state && data.state !== address.state) ||
        (data.neighborhood && data.neighborhood !== address.neighborhood) ||
        (data.address && data.address !== address.address) ||
        (data.sub_neighborhood &&
          data.sub_neighborhood !== address.sub_neighborhood) ||
        (data.postal_code && data.postal_code !== address.postal_code)
      ) {
        return false;
      }
      return true;
    });

    return findAddress;
  }

  public async create(addressData: ICreateAddressDTO): Promise<Address> {
    const address = new Address();

    Object.assign(address, { id: uuid() }, addressData);

    this.adresses.push(address);

    return address;
  }

  public async delete(id: string): Promise<void> {
    this.adresses = this.adresses.filter(address => address.id !== id);
  }

  public async save(address: Address): Promise<Address> {
    const findIndex = this.adresses.findIndex(
      findAddress => findAddress.id === address.id,
    );

    this.adresses[findIndex] = address;

    return address;
  }
}

export default FakeAdressesRepository;
