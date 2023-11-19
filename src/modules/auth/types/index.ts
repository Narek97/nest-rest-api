import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseType } from '../../../common/types/base.response-type';

export class RegisterUserRequest {
  @ApiProperty({ example: 'john@gmail.com' })
  email: number;

  @ApiProperty({ example: 'John' })
  firstname: string;

  @ApiProperty({ example: 'Wick' })
  lastname: string;

  @ApiProperty({ example: '12345678' })
  password: string;

  @ApiProperty({ example: 1 })
  orgId: number;
}

export class RegisterUserResponse extends BaseResponseType {
  @ApiProperty({ example: 1 })
  orgId: number;

  @ApiProperty({ example: 'john@gmail.com' })
  email: number;

  @ApiProperty({ example: 'John' })
  firstname: string;

  @ApiProperty({ example: 'Wick' })
  lastname: string;

  @ApiProperty({ example: false })
  verified: boolean;
}
