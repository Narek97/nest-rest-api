import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseType {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '2023-11-19 12:45:44' })
  createdAt: string;

  @ApiProperty({ example: '2023-11-19 12:45:44' })
  updatedAt: string;
}

export class BaseMessageResponseType {
  @ApiProperty({ example: 'some text' })
  message: string;
}

export class QRCodeType {
  @ApiProperty({ example: 'data:image.png.abc......ew3ir==' })
  qrCode: string;
}
