import AppError from '@shared/errors/AppErrors';

import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import { UserTypeEnum } from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../../providers/HashProvider/fakes/FakeHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from '../users/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeCacheProvider = new FakeCacheProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '23434',
      type: UserTypeEnum.USER,
    });

    const response = await authenticateUser.execute({
      email: 'johndoe@example.com',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const createUser = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeCacheProvider,
    );

    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '23434',
      type: UserTypeEnum.USER,
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@example.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
