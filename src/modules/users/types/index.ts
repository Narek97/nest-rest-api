import { BaseResponseType } from '../../../common/types/base.response-type';
import { ApiProperty } from '@nestjs/swagger';

export class GetMeResponse extends BaseResponseType {
  @ApiProperty({ example: 1 })
  orgId: number;

  @ApiProperty({ example: 'john@gmail.com' })
  email: number;

  @ApiProperty({ example: 'John' })
  firstname: string;

  @ApiProperty({ example: 'Wick' })
  lastname: string;

  @ApiProperty({ example: '' })
  avatar: string;

  @ApiProperty({ example: false })
  verified: boolean;
}

export class ToggleTwoFactorVerificationResponse {
  @ApiProperty({ example: true })
  isEnable: boolean;
}
