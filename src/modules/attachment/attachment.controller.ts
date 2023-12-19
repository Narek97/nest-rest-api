import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AttachmentService } from './attachment.service';
import {
  AnyFilesInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
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
  ): Promise<Attachment> {
    return this.attachmentService.uploadAttachment(data, file, user);
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
  ): Promise<{ id: number; deleted: boolean }> {
    return this.attachmentService.deleteFile(id);
  }
}
