import * as dotenv from 'dotenv';
dotenv.config();

export const JwtConfigOptions = {
  secret: process.env.JWT_KEY,
  signOptions: {
    expiresIn: '24h',
  },
};
