// import AppError from '@shared/errors/AppErrors';

import { UserTypeEnum } from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import ListUsersService from './ListUsersService';

let fakeUsersRepository: FakeUsersRepository;
let listUsers: ListUsersService;

describe('ListUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listUsers = new ListUsersService(fakeUsersRepository);
  });

  it('should be able to list users', async () => {
    const users = await listUsers.execute({});

    expect(users).toEqual([]);

    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '21321321',
      type: UserTypeEnum.USER,
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Trê',
      email: 'johntre@example.com',
      password: '123456',
      phone: '21321321',
      type: UserTypeEnum.USER,
    });

    expect(users).toEqual([user1, user2]);
  });
});
