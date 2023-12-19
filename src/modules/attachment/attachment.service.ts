import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { UpdateAttachmentDto } from './dto/update-attachment.dto';
import { Attachment, User } from '../../database/models';
import { v4 as uuid } from 'uuid';
import { AWSS3Service } from '../../services/aws-s3.service';

@Injectable()
export class AttachmentService {
  constructor(private readonly s3Service: AWSS3Service) {}
  async uploadAttachment(
    data: UpdateAttachmentDto,
    file: Express.Multer.File,
    user: User,
  ): Promise<Attachment> {
    try {
      const { folder, relatedId = null } = data;
      const { originalname } = file;
      const key = `${folder}/${user.id}/${originalname}-${uuid()}`;
      const uploadFile = await this.s3Service.upload(file, key);
      return await Attachment.create({
        userId: user.id,
        folder,
        relatedId,
        url: uploadFile.Location,
        key,
      });
    } catch (err) {
      throw new BadRequestException({ message: 'AWS Error ...' }, err);
    }
  }

  async deleteFile(id: number): Promise<{ id: number; deleted: boolean }> {
    try {
      const file = await Attachment.findByPk(id);
      if (!file) {
        throw new HttpException(
          { message: 'file not found' },
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.s3Service.delete(file.key);
      await Attachment.destroy({
        where: {
          id,
        },
      });
      return {
        id: file.id,
        deleted: true,
      };
    } catch (err) {
      throw new BadRequestException({ message: 'AWS Error ...' }, err);
    }
  }
}
