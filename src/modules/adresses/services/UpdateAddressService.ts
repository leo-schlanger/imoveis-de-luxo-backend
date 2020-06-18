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
    number,
    complement,
    description,
  }: IRequest): Promise<Address> {
    const address = await this.adressesRepository.findById(address_id);

    if (!address) {
      throw new AppError('Address not found.');
    }

    if (country) {
      address.country = country;
    }

    if (state) {
      address.state = state;
    }

    if (postal_code) {
      address.postal_code = postal_code;
    }

    if (neighborhood) {
      address.neighborhood = neighborhood;
    }

    if (sub_neighborhood) {
      address.sub_neighborhood = sub_neighborhood;
    }

    if (number) {
      address.number = number;
    }

    if (complement) {
      address.complement = complement;
    }

    if (description) {
      address.description = description;
    }

    return this.adressesRepository.save(address);
  }
}

export default UpdateProfileService;
