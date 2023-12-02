import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserAccept } from '../../database/models';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Op } from 'sequelize';
import { MailService } from '../mail/mail.service';
import { v4 as uuid } from 'uuid';
import { UsersService } from '../users/users.service';

@Injectable()
export class AcceptService {
  constructor(
    readonly userService: UsersService,
    readonly mailService: MailService,
  ) {}

  async createUserAccept(userId: number, acceptId: string): Promise<void> {
    await UserAccept.create({ userId, acceptId });
  }

  async findVerifyUserByUserId(userId: number): Promise<UserAccept> {
    return UserAccept.findOne({
      where: {
        userId,
      },
    });
  }

  async findAndVerifyUserByAcceptId(verifyId: string): Promise<UserAccept> {
    const verifyUser = await UserAccept.findOne({
      where: {
        acceptId: verifyId,
      },
    });
    if (!verifyUser) {
      throw new HttpException('invalid response url', HttpStatus.BAD_REQUEST);
    }
    await UserAccept.destroy({
      where: {
        userId: verifyUser.userId,
        acceptId: verifyId,
      },
    });
    return verifyUser;
  }

  //Crone
  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async senUserUnblockingNotification() {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1);

    await UserAccept.findAll({
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
          await this.createUserAccept(user.id, activationLink);

          return UserAccept.destroy({
            where: {
              userId: el.userId,
              acceptId: el.acceptId,
            },
          });
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
