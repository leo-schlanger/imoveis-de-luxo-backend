import AppError from '@shared/errors/AppErrors';

import FakePlansRepository from '../../repositories/fakes/FakePlansRepository';

import DeletePlanService from './DeletePlanService';

let fakePlansRepository: FakePlansRepository;
let deletePlan: DeletePlanService;

describe('deletePlan', () => {
  beforeEach(() => {
    fakePlansRepository = new FakePlansRepository();
    deletePlan = new DeletePlanService(fakePlansRepository);
  });

  it('should be able to delete a plan', async () => {
    const plan = await fakePlansRepository.create({
      name: 'plan_name',
      description: 'plan_description',
      quantity_properties: 6,
      quantity_photos: 20,
      quantity_videos: 2,
      value: 19.9,
    });

    await fakePlansRepository.save(plan);

    expect(plan).toHaveProperty('id');

    const confirmPlan = await fakePlansRepository.findById(plan.id);
    expect(confirmPlan).toBe(plan);

    await deletePlan.execute({ plan_id: plan.id });

    const confirmPlanDeleted = await fakePlansRepository.findById(plan.id);

    expect(confirmPlanDeleted).toBeUndefined();
  });

  it('should not be able to delete a non-exists plan', async () => {
    await expect(
      deletePlan.execute({
        plan_id: 'non-exists-id',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
