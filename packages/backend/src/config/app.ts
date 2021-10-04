import * as dotenv from 'dotenv';
dotenv.config();

type AppConfig = {
  port: string,
  appEnv: string,
}

const appConfig: AppConfig = {
  port: process.env.PORT || '3000',
  appEnv: process.env.APP_ENV || 'development',
}

export default appConfig;
