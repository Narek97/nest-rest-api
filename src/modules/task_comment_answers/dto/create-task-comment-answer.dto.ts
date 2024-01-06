import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateTaskCommentAnswerDto {
  @MaxLength(250)
  @IsNotEmpty()
  readonly answer: string;

  @IsOptional()
  readonly taskCommentId: number;
}
