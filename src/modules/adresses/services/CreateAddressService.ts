import { inject } from 'tsyringe';

import Address from '../infra/typeorm/entities/Address';
import IAdressesRepository from '../repositories/IAdressesRepository';

interface IRequest {
  country: string;
  state: string;
  postal_code: string;
  neighborhood: string;
  sub_neighborhood?: string;
  number?: string;
  complement?: string;
  description?: string;
}

class CreateAddressService {
  constructor(
    @inject('AdressesRepository')
    private adressesRepository: IAdressesRepository,
  ) {}

  public async execute(data: IRequest): Promise<Address> {
    const address = this.adressesRepository.create(data);

    return address;
  }
}

export default CreateAddressService;
