import ICreateAdvertisementDTO from '@modules/advertisements/dtos/ICreateAdvertisementDTO';
import Advertisement, {
  AdvertisementTypeEnum,
} from '../infra/typeorm/entities/Advertisement';
import IShowAdvertisementsDTO from '../dtos/IShowAdvertisementsDTO';

export default interface IAdvertisementsRepository {
  show(data: IShowAdvertisementsDTO): Promise<[Advertisement[], number]>;
  findById(id: number): Promise<Advertisement | undefined>;
  findByProperty(property_id: string): Promise<Advertisement | undefined>;
  filterByType(
    type: AdvertisementTypeEnum,
  ): Promise<Advertisement[] | undefined>;
  create(data: ICreateAdvertisementDTO): Promise<Advertisement>;
  delete(id: number): Promise<void>;
  save(Advertisement: Advertisement): Promise<Advertisement>;
}
