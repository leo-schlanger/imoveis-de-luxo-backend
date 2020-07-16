import AppError from '@shared/errors/AppErrors';

import { UserTypeEnum } from '@modules/users/infra/typeorm/entities/User';
import FakePlansRepository from '../../repositories/fakes/FakePlansRepository';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import UpdateUserPlanService from './UpdateUserPlanService';

let fakeUsersRepository: FakeUsersRepository;
let fakePlansRepository: FakePlansRepository;
let updateUserPlan: UpdateUserPlanService;

describe('UpdateUserPlan', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakePlansRepository = new FakePlansRepository();
    updateUserPlan = new UpdateUserPlanService(
      fakeUsersRepository,
      fakePlansRepository,
    );
  });

  it('should be able to update user plan', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '21321321',
      type: UserTypeEnum.ADVERTISER,
    });

    const plan = await fakePlansRepository.create({
      name: 'plan',
      quantity_photos: 20,
      quantity_properties: 50,
      quantity_videos: 3,
      value: 38.9,
    });

    const updatedUser = await updateUserPlan.execute({
      user_id: user.id,
      plan_id: plan.id,
    });

    expect(updatedUser.plan_id).toBe(plan.id);
    expect(updatedUser.plan_status).toBe(true);
  });

  it('should not be able to update user plan from non advertiser user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '21321321',
      type: UserTypeEnum.USER,
    });

    const plan = await fakePlansRepository.create({
      name: 'plan',
      quantity_photos: 20,
      quantity_properties: 50,
      quantity_videos: 3,
      value: 38.9,
    });

    await expect(
      updateUserPlan.execute({
        user_id: user.id,
        plan_id: plan.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update plan from non existing user', async () => {
    const plan = await fakePlansRepository.create({
      name: 'plan',
      quantity_photos: 20,
      quantity_properties: 50,
      quantity_videos: 3,
      value: 38.9,
    });

    await expect(
      updateUserPlan.execute({
        user_id: 'non-existing-user',
        plan_id: plan.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update plan from non existing plan', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
      phone: '21321321',
      type: UserTypeEnum.USER,
    });

    await expect(
      updateUserPlan.execute({
        user_id: user.id,
        plan_id: 'non-existing-plan',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
