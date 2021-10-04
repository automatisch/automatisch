import * as dotenv from 'dotenv';
dotenv.config();

type AppConfig = {
  host: string,
  protocol: string
  port: string,
  corsPort: string,
  appEnv: string,
}

const appConfig: AppConfig = {
  host: process.env.HOST || 'localhost',
  protocol: process.env.PROTOCOL || 'http',
  port: process.env.PORT || '3000',
  corsPort: process.env.CORS_PORT || '3001',
  appEnv: process.env.APP_ENV || 'development',
}

export default appConfig;
