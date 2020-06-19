import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppErrors';

import Address from '@modules/adresses/infra/typeorm/entities/Address';
import IAdressesRepository from '@modules/adresses/repositories/IAdressesRepository';

import User from '../infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IRequest {
  user_id: string;
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
class UpdateProfileAddressService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('AdressesRepository')
    private adressesRepository: IAdressesRepository,
  ) {}

  public async execute({ user_id, ...rest }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User not found.');
    }

    let address: Address | undefined;
    if (user.address_id) {
      address = await this.adressesRepository.findById(user.address_id);

      if (!address) {
        throw new AppError('Address not found');
      }

      Object.assign(address, rest);
    } else {
      if (
        !rest.country ||
        !rest.state ||
        !rest.postal_code ||
        !rest.neighborhood
      ) {
        throw new AppError('Invalid parameters in the first registration');
      }

      const data = {
        country: rest.country,
        state: rest.state,
        postal_code: rest.postal_code,
        neighborhood: rest.neighborhood,
        sub_neighborhood: rest.sub_neighborhood,
        number: rest.number,
        complement: rest.complement,
        description: rest.description,
      };

      address = await this.adressesRepository.create(data);
      user.address_id = address.id;
    }
    await this.adressesRepository.save(address);

    return this.usersRepository.save(user);
  }
}

export default UpdateProfileAddressService;
