import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAttachmentDto {
  @IsNotEmpty()
  @IsString()
  folder: string;

  @IsOptional()
  relatedId: number;
}
