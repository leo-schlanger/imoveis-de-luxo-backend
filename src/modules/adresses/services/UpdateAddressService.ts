import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import Address from '../infra/typeorm/entities/Address';
import IAdressesRepository from '../repositories/IAdressesRepository';

interface IRequest {
  address_id: string;
  country?: string;
  state?: string;
  postal_code?: string;
  neighborhood?: string;
  sub_neighborhood?: string;
  address?: string;
  number?: string;
  complement?: string;
  description?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('AdressesRepository')
    private adressesRepository: IAdressesRepository,
  ) {}

  public async execute({
    address_id,
    country,
    state,
    postal_code,
    neighborhood,
    sub_neighborhood,
    address,
    number,
    complement,
    description,
  }: IRequest): Promise<Address> {
    const searchAddress = await this.adressesRepository.findById(address_id);

    if (!searchAddress) {
      throw new AppError('Address not found.');
    }

    if (country) {
      searchAddress.country = country;
    }

    if (state) {
      searchAddress.state = state;
    }

    if (postal_code) {
      searchAddress.postal_code = postal_code;
    }

    if (neighborhood) {
      searchAddress.neighborhood = neighborhood;
    }

    if (sub_neighborhood) {
      searchAddress.sub_neighborhood = sub_neighborhood;
    }

    if (address) {
      searchAddress.address = address;
    }

    if (number) {
      searchAddress.number = number;
    }

    if (complement) {
      searchAddress.complement = complement;
    }

    if (description) {
      searchAddress.description = description;
    }

    return this.adressesRepository.save(searchAddress);
  }
}

export default UpdateProfileService;
