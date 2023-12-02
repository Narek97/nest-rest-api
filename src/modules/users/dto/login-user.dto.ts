import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class loginUserDto {
  @IsNotEmpty()
  @MaxLength(100)
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @MinLength(8)
  readonly password: string;
}
