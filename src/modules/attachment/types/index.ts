import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UploadFileReques {
  @ApiProperty({ example: 'user' })
  folder: string;

  @ApiProperty({ example: 1 })
  @ApiPropertyOptional({ example: null })
  relatedId: number | null;
}

export class UploadFileRequest {
  @ApiProperty({ example: 1 })
  userId: number;

  @ApiProperty({ example: 'user' })
  folder: string;

  @ApiProperty({ example: 1 })
  relatedId: number;

  @ApiProperty({
    example:
      'https://nest-shop.s3.amazonaws.com/user/22/1683554111453.png-a0ad084a-b8f6-462b-b410-99550bb9c9ec',
  })
  url: string;

  @ApiProperty({
    example: 'user/22/1683554111453.png-a0ad084a-b8f6-462b-b410-99550bb9c9ec',
  })
  key: string;
}
