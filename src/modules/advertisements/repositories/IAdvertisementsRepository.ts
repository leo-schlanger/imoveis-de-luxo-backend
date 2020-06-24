import ICreateAdvertisementDTO from '@modules/advertisements/dtos/ICreateAdvertisementDTO';
import Advertisement, {
  AdvertisementTypeEnum,
} from '../infra/typeorm/entities/Advertisement';

export default interface IAdvertisementsRepository {
  show(): Promise<Advertisement[]>;
  findById(id: string): Promise<Advertisement | undefined>;
  findByProperty(property_id: string): Promise<Advertisement | undefined>;
  filterByType(
    type: AdvertisementTypeEnum,
  ): Promise<Advertisement[] | undefined>;
  create(data: ICreateAdvertisementDTO): Promise<Advertisement>;
  delete(id: string): Promise<void>;
  save(Advertisement: Advertisement): Promise<Advertisement>;
}