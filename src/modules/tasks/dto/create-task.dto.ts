import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @MaxLength(100)
  @IsNotEmpty()
  readonly title: string;

  @IsOptional()
  readonly description: string;

  @IsNotEmpty()
  readonly dueDate: Date;

  @IsNotEmpty()
  readonly initiativeId: number;
}
