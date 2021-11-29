import * as dotenv from 'dotenv';
dotenv.config();

type AppConfig = {
  host: string,
  protocol: string
  port: string,
  webAppUrl: string,
  appEnv: string,
  postgresDatabase: string,
  postgresPort: number,
  postgresHost: string,
  postgresUsername: string,
  postgresPassword: string,
  postgresEnableSsl: boolean,
  baseUrl?: string,
  encryptionKey: string
}

const appConfig: AppConfig = {
  host: process.env.HOST || 'localhost',
  protocol: process.env.PROTOCOL || 'http',
  port: process.env.PORT || '3000',
  webAppUrl: process.env.WEB_APP_URL || 'https://localhost:3001',
  appEnv: process.env.APP_ENV || 'development',
  postgresDatabase: process.env.POSTGRES_DATABASE || 'automatisch_development',
  postgresPort: parseInt(process.env.POSTGRES_PORT) || 5432,
  postgresHost: process.env.POSTGRES_HOST || 'localhost',
  postgresUsername: process.env.POSTGRES_USERNAME || 'automatish_development_user',
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresEnableSsl: process.env.POSTGRES_ENABLE_SSL === 'true' ? true : false,
  encryptionKey: process.env.ENCRYPTION_KEY
}

if(!appConfig.encryptionKey) {
  throw new Error('ENCRYPTION_KEY environment variable needs to be set!');
}

const baseUrl = `${appConfig.protocol}://${appConfig.host}:${appConfig.port}`;
appConfig.baseUrl = baseUrl;

export default appConfig;
