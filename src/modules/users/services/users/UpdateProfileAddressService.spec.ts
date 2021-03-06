import AppError from '@shared/errors/AppErrors';

import FakeAdressesRepository from '@modules/adresses/repositories/fakes/FakeAdressesRepository';
import { UserTypeEnum } from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import UpdateProfileAddressService from './UpdateProfileAddressService';

let fakeUsersRepository: FakeUsersRepository;
let fakeAdressesRepository: FakeAdressesRepository;
let updateProfileAddress: UpdateProfileAddressService;

describe('UpdateAddressProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeAdressesRepository = new FakeAdressesRepository();
    updateProfileAddress = new UpdateProfileAddressService(
      fakeUsersRepository,
      fakeAdressesRepository,
    );
  });

  it('should be able to update a new address', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '21321321',
      type: UserTypeEnum.USER,
    });

    const updatedUser = await updateProfileAddress.execute({
      user_id: user.id,
      country: 'Brasil',
      state: 'Rio de Janeiro',
      postal_code: '22222-222',
      street: 'My address',
      neighborhood: 'Copacabana',
    });

    expect(updatedUser.address_id).not.toBeNull();
  });

  it('should be able to update a new address', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '21321321',
      type: UserTypeEnum.USER,
    });

    await updateProfileAddress.execute({
      user_id: user.id,
      country: 'Brasil',
      state: 'Rio de Janeiro',
      postal_code: '22222-222',
      street: 'My address',
      neighborhood: 'Copacabana',
    });

    const updatedUser = updateProfileAddress.execute({
      user_id: user.id,
      postal_code: '11111-111',
    });

    const address = await fakeAdressesRepository.findById(
      (await updatedUser).address_id,
    );

    expect(address?.postal_code).toBe('11111-111');
  });

  it('should not be able to update a address in non-existing address id', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '21321321',
      type: UserTypeEnum.USER,
    });

    const updatedUser = await updateProfileAddress.execute({
      user_id: user.id,
      country: 'Brasil',
      state: 'Rio de Janeiro',
      postal_code: '22222-222',
      neighborhood: 'Copacabana',
      street: 'My address',
    });

    fakeAdressesRepository.delete(updatedUser.address_id);

    await expect(
      updateProfileAddress.execute({
        user_id: user.id,
        postal_code: '11111-111',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a address with missing main variables', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '21321321',
      type: UserTypeEnum.USER,
    });

    await expect(
      updateProfileAddress.execute({
        user_id: user.id,
        country: 'Brasil',
        state: 'Rio de Janeiro',
        neighborhood: 'Copacabana',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the address from non-existing user', async () => {
    await expect(
      updateProfileAddress.execute({
        user_id: 'non-existing-user',
        country: 'Brasil',
        state: 'Rio de Janeiro',
        postal_code: '22222-222',
        street: 'My address',
        neighborhood: 'Copacabana',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
