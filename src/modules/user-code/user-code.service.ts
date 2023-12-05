import { Injectable } from '@nestjs/common';
import { UserCode } from '../../database/models';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { MailService } from '../mail/mail.service';
import { v4 as uuid } from 'uuid';
import { UsersService } from '../users/users.service';

@Injectable()
export class UserCodeService {
  constructor(
    readonly userService: UsersService,
    readonly mailService: MailService,
  ) {}

  async createUserCode(userId: number, code: string): Promise<void> {
    await UserCode.create({ userId, code });
  }

  async findVerifyUserIdByUserId(userId: number): Promise<UserCode> {
    return UserCode.findOne({
      where: {
        userId,
      },
    });
  }

  async findVerifyUserIdByCode(code: string): Promise<UserCode> {
    return UserCode.findOne({
      where: {
        code,
      },
    });
  }

  //Crone
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async senUserUnblockingNotification() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    await UserCode.findAll({
      where: {
        createdAt: {
          [Op.lt]: currentDate,
        },
      },
    })
      .then((item) => {
        item.forEach(async (el) => {
          const activationLink = uuid();
          const user = await this.userService.getUserById(el.userId);
          await this.mailService.sendSignupVerifyEmail(
            user.email,
            activationLink,
          );
          await this.createUserCode(user.id, activationLink);

          return UserCode.destroy({
            where: {
              userId: el.userId,
              code: el.code,
            },
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
