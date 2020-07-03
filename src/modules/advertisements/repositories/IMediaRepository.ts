import ICreateMediaDTO from '@modules/advertisements/dtos/ICreateMediaDTO';
import Media from '../infra/typeorm/entities/Media';

// TODO: analisar as necessidades do repositório de mídia
export default interface IMediaRepository {
  show(): Promise<Media[]>;
  findById(id: string): Promise<Media | undefined>;
  findByAdvertisement(advertisement_id: string): Promise<Media[] | undefined>;
  create(data: ICreateMediaDTO): Promise<Media>;
  delete(id: string): Promise<void>;
  save(Media: Media): Promise<Media>;
}
