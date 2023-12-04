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

export class LoginUserRequest {
  @ApiProperty({ example: 'john@gmail.com' })
  email: number;

  @ApiProperty({ example: '12345678' })
  password: string;
}

export class LoginUserResponse {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  accessToken: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  refreshToken: string;
}

export class LoginCodeReques {
  @ApiProperty({ example: '12345678' })
  code: string;
}
