import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyTwoFADto {
  @IsNotEmpty()
  @IsString()
  code: string;
}
