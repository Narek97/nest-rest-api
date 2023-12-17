import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFAService {
  async generateSecret(key?: string | number) {
    return speakeasy.generateSecret({
      name: key ? `Nest course: ${key}` : 'Nest course',
    });
  }

  async getQRCode(gToken: string): Promise<string> {
    return new Promise((resolve, reject) => {
      return QRCode.toDataURL(gToken, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }

  async verifyQRCode(gToken: string, code: string): Promise<boolean> {
    const secret = gToken.substring(gToken.indexOf('='), gToken.length);
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: code,
    });
  }
}
