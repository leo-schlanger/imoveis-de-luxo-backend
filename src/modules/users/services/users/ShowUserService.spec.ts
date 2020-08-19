import AppError from '@shared/errors/AppErrors';

import { UserTypeEnum } from '@modules/users/infra/typeorm/entities/User';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import ShowUserService from './ShowUserService';

let fakeUsersRepository: FakeUsersRepository;
let showUser: ShowUserService;

describe('ShowUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showUser = new ShowUserService(fakeUsersRepository);
  });

  it('should be able to show the user', async () => {
    const userExample = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '123456',
      type: UserTypeEnum.ADM,
    });

    const user = await showUser.execute({
      user_id: userExample.id,
    });

    expect(user?.name).toBe('John Doe');
    expect(user?.type).toBe(UserTypeEnum.ADM);
  });

  it('should not be able to show the user from non-existing user', async () => {
    await expect(
      showUser.execute({
        user_id: 'non-existing-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
