import AppError from '@shared/errors/AppErrors';

import FakePlansRepository from '../../repositories/fakes/FakePlansRepository';
import UpdatePlanService from './UpdatePlanService';

let fakePlansRepository: FakePlansRepository;
let updatePlan: UpdatePlanService;

describe('UpdatePlan', () => {
  beforeEach(() => {
    fakePlansRepository = new FakePlansRepository();
    updatePlan = new UpdatePlanService(fakePlansRepository);
  });

  it('should be able to update a plan', async () => {
    const plan = await fakePlansRepository.create({
      name: 'plan_name',
      quantity_properties: 6,
      quantity_photos: 20,
      quantity_videos: 2,
      value: 19.9,
    });

    const updatedPlan = await updatePlan.execute({
      plan_id: plan.id,
      name: 'plan_name',
      description: 'plan_description',
      quantity_properties: 6,
      quantity_photos: 30,
      quantity_videos: 2,
      value: 19.9,
    });

    expect(updatedPlan.description).toBe('plan_description');
    expect(updatedPlan.quantity_photos).toBe(30);
  });

  it('should not be able to update the profile from non-existing plan', async () => {
    await expect(
      updatePlan.execute({
        plan_id: 'non-existing-plan',
        name: 'plan_name',
        description: 'plan_description',
        quantity_properties: 6,
        quantity_photos: 20,
        quantity_videos: 2,
        value: 19.9,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
