import { Injectable } from '@nestjs/common';
import { UserCode } from '../../database/models';
import { MailService } from '../mail/mail.service';
import { UsersService } from '../users/users.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UserCodeService {
  constructor(
    readonly mailService: MailService,
    readonly userService: UsersService,
  ) {}

  async createUserCode(userId: number, code: string): Promise<void> {
    await UserCode.create({ userId, code });
  }

  async findUserCodeByCode(code: string): Promise<UserCode> {
    return UserCode.findOne({
      where: {
        code,
      },
    });
  }

  //Crone
  // @Cron(CronExpression.EVERY_DAY_AT_1AM)
  // async senUserUnblockingNotification() {
  //   const currentDate = new Date();
  //   currentDate.setDate(currentDate.getDate() - 1);
  //
  //   await UserCode.findAll({
  //     where: {
  //       createdAt: {
  //         [Op.lt]: currentDate,
  //       },
  //     },
  //   })
  //     .then((item) => {
  //       item.forEach(async (el) => {
  //         const activationLink = uuid();
  //         const user = await this.userService.getUserById(el.userId);
  //         await this.mailService.sendSignupVerifyEmail(
  //           user.email,
  //           activationLink,
  //         );
  //         await this.createUserCode(user.id, activationLink);
  //
  //         return UserCode.destroy({
  //           where: {
  //             userId: el.userId,
  //             code: el.code,
  //           },
  //         });
  //       });
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }
}
