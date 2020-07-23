import { getRepository, Repository } from 'typeorm';

import IMediaRepository from '@modules/advertisements/repositories/IMediaRepository';
import ICreateMediaDTO from '@modules/advertisements/dtos/ICreateMediaDTO';
import Media from '../entities/Media';

class MediaRepository implements IMediaRepository {
  private ormRepository: Repository<Media>;

  constructor() {
    this.ormRepository = getRepository(Media);
  }

  public async show(): Promise<Media[]> {
    return this.ormRepository.find();
  }

  public async findById(id: string): Promise<Media | undefined> {
    const findMedia = await this.ormRepository.findOne(id);

    return findMedia;
  }

  public async findByAdvertisement(
    advertisement_id: string,
  ): Promise<Media[] | undefined> {
    const findMedia = await this.ormRepository.find({
      where: {
        advertisement_id,
      },
    });

    return findMedia;
  }

  public async create({
    advertisement_id,
    filename,
    type,
  }: ICreateMediaDTO): Promise<Media> {
    const media = this.ormRepository.create({
      advertisement_id,
      filename,
      type,
    });

    await this.ormRepository.save(media);

    return media;
  }

  public createWithoutSave({
    advertisement_id,
    filename,
    type,
  }: ICreateMediaDTO): Media {
    const media = this.ormRepository.create({
      advertisement_id,
      filename,
      type,
    });

    return media;
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(media: Media): Promise<Media> {
    return this.ormRepository.save(media);
  }
}

export default MediaRepository;
