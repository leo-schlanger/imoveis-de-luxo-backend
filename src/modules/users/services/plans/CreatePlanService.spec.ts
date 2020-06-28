import FakePlansRepository from '../../repositories/fakes/FakePlansRepository';
import CreatePlanService from './CreatePlanService';

let fakePlansRepository: FakePlansRepository;
let createPlan: CreatePlanService;

describe('CreatePlan', () => {
  beforeEach(() => {
    fakePlansRepository = new FakePlansRepository();
    createPlan = new CreatePlanService(fakePlansRepository);
  });

  it('should be able to create a new plan', async () => {
    const plan = await createPlan.execute({
      name: 'plan_name',
      description: 'plan_description',
      quantity_properties: 6,
      quantity_photos: 20,
      quantity_videos: 2,
      value: 19.9,
    });

    expect(plan).toHaveProperty('id');
  });
});
