import { MediaTypeEnum } from '../infra/typeorm/entities/Media';

export default interface ICreateMediaDTO {
  advertisement_id: number;
  filename: string;
  type: MediaTypeEnum;
}
