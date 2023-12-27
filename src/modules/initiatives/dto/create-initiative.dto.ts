import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';

export class CreateInitiativeDto {
  @MaxLength(100)
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  readonly workspaceId: number;

  @IsNotEmpty()
  readonly orgId: number;
}
