import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MaxLength(100)
  readonly firstname: string;

  @IsNotEmpty()
  @MaxLength(100)
  readonly lastname: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  readonly orgId: number;
}
