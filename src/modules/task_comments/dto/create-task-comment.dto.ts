import { IsNotEmpty, MaxLength } from 'class-validator';

export class CreateTaskCommentDto {
  @MaxLength(250)
  @IsNotEmpty()
  readonly comment: string;

  @IsNotEmpty()
  readonly taskId: number;
}
