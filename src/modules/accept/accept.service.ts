import { Injectable } from '@nestjs/common';
import { UserAccept } from '../../database/models';

@Injectable()
export class AcceptService {
  async createUserAccept(userId: number, acceptId: string): Promise<void> {
    await UserAccept.create({ userId, acceptId });
  }
}
