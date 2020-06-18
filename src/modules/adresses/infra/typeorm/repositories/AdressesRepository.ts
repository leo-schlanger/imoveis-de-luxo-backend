import { getRepository, Repository } from 'typeorm';

import IAdressesRepository from '@modules/adresses/repositories/IAdressesRepository';
import ICreateAddressDTO from '@modules/adresses/dtos/ICreateAddressDTO';
import IFilterAddressDTO from '@modules/adresses/dtos/IFilterAddressDTO';

import Address from '../entities/Address';

class AdressesRepository implements IAdressesRepository {
  private ormRepository: Repository<Address>;

  constructor() {
    this.ormRepository = getRepository(Address);
  }

  public async findById(id: string): Promise<Address | undefined> {
    const findAddress = await this.ormRepository.findOne(id);

    return findAddress;
  }

  public async filter(data: IFilterAddressDTO): Promise<Address[] | undefined> {
    const findAddress = await this.ormRepository.find({
      where: { data },
    });

    return findAddress;
  }

  public async create(addressData: ICreateAddressDTO): Promise<Address> {
    const address = this.ormRepository.create(addressData);

    await this.ormRepository.save(address);

    return address;
  }

  public async save(address: Address): Promise<Address> {
    return this.ormRepository.save(address);
  }
}

export default AdressesRepository;
