import { IsString } from 'class-validator';

export class ProsConsDiscusserDTO {
  @IsString()
  readonly prompt: string;
}
