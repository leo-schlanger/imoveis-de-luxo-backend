import { uuid } from 'uuidv4';

import IMediaRepository from '@modules/advertisements/repositories/IMediaRepository';
import ICreateMediaDTO from '@modules/advertisements/dtos/ICreateMediaDTO';
import Media from '../../infra/typeorm/entities/Media';

class MediaRepository implements IMediaRepository {
  private media: Media[] = [];

  public async show(): Promise<Media[]> {
    return this.media;
  }

  public async findById(id: string): Promise<Media | undefined> {
    const findMedia = this.media.find(media => media.id === id);

    return findMedia;
  }

  public async findByAdvertisement(
    advertisement_id: string,
  ): Promise<Media[] | undefined> {
    const findMedia = this.media.filter(
      media => media.advertisement_id === advertisement_id,
    );

    return findMedia;
  }

  public async create({
    advertisement_id,
    filename,
    type,
  }: ICreateMediaDTO): Promise<Media> {
    const media = new Media();

    Object.assign(
      media,
      { id: uuid() },
      {
        advertisement_id,
        filename,
        type,
      },
    );

    this.media.push(media);

    return media;
  }

  public createWithoutSave({
    advertisement_id,
    filename,
    type,
  }: ICreateMediaDTO): Media {
    const media = new Media();

    Object.assign(
      media,
      { id: uuid() },
      {
        advertisement_id,
        filename,
        type,
      },
    );

    return media;
  }

  public async delete(id: string): Promise<void> {
    const newList = this.media.filter(media => media.id !== id);

    this.media = newList;
  }

  public async save(media: Media): Promise<Media> {
    const findIndex = this.media.findIndex(
      findMedia => findMedia.id === media.id,
    );

    this.media[findIndex] = media;

    return media;
  }
}

export default MediaRepository;
