import * as dotenv from 'dotenv';
dotenv.config();

type AppEnv = {
  port: string,
}

const appEnv: AppEnv = {
  port: process.env.PORT || '3000',
}

export default appEnv;
