import FakePlansRepository from '../../repositories/fakes/FakePlansRepository';
import ShowPlansService from './ShowPlansService';

let fakePlansRepository: FakePlansRepository;
let showPlans: ShowPlansService;

describe('ShowPlans', () => {
  beforeEach(() => {
    fakePlansRepository = new FakePlansRepository();
    showPlans = new ShowPlansService(fakePlansRepository);
  });

  it('should be able to show the profile', async () => {
    const plan1 = await fakePlansRepository.create({
      name: 'plan_name',
      description: 'plan_description',
      quantity_properties: 6,
      quantity_photos: 20,
      quantity_videos: 2,
      value: 19.9,
    });

    const plan2 = await fakePlansRepository.create({
      name: 'plan_name',
      description: 'plan_description',
      quantity_properties: 6,
      quantity_photos: 30,
      quantity_videos: 5,
      value: 49.9,
    });

    const plans = await showPlans.execute();

    expect(plans).toEqual([plan1, plan2]);
  });
});
