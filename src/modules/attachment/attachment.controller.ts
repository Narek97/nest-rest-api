import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '../../guards/auth.guard';
import { GetUser } from '../../decorators/user.decorator';
import { Attachment, User } from '../../database/models';
import { Express } from 'express';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UploadFileReques, UploadFileRequest } from './types';

@ApiTags('Attachment')
@Controller('attachment')
@UseGuards(AuthGuard)
export class AttachmentController {
  constructor(private readonly attachmentService: AttachmentService) {}

  @ApiBody({ type: UploadFileReques })
  @ApiOkResponse({ type: UploadFileRequest })
  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadUserFile(
    @GetUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() data: UpdateAttachmentDto,
    @Req() { sqlRowQueries }: any,
  ): Promise<Attachment> {
    return this.attachmentService.uploadAttachment(
      data,
      file,
      user,
      sqlRowQueries,
    );
  }

  @Post('/multi-upload')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFile(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
  }

  @Delete('/delete/:id')
  @UseInterceptors(FileInterceptor('file'))
  async deleteUserFile(
    @Param('id') id: number,
    @Req() { sqlRowQueries }: any,
  ): Promise<{ id: number; deleted: boolean }> {
    return this.attachmentService.deleteFile(id, sqlRowQueries);
  }
}
