import * as dotenv from 'dotenv';
dotenv.config();

type AppConfig = {
  host: string,
  protocol: string
  port: string,
  corsPort: string,
  corsProtocol: string,
  appEnv: string,
  postgresDatabase: string,
  postgresPort: number,
  postgresHost: string,
  postgresUsername: string,
  postgresPassword: string,
  baseUrl?: string
  webAppUrl?: string
}

const appConfig: AppConfig = {
  host: process.env.HOST || 'localhost',
  protocol: process.env.PROTOCOL || 'http',
  port: process.env.PORT || '3000',
  corsPort: process.env.CORS_PORT || '3001',
  corsProtocol: process.env.CORS_PROTOCOL || 'http',
  appEnv: process.env.APP_ENV || 'development',
  postgresDatabase: process.env.POSTGRES_DATABASE || 'automatisch_development',
  postgresPort: parseInt(process.env.POSTGRES_PORT) || 5432,
  postgresHost: process.env.POSTGRES_HOST || 'localhost',
  postgresUsername: process.env.POSTGRES_USERNAME || 'automatish_development_user',
  postgresPassword: process.env.POSTGRESS_PASSWORD,
}

const webAppUrl = `${appConfig.corsProtocol}://${appConfig.host}:${appConfig.corsPort}`;
appConfig.webAppUrl = webAppUrl;

const baseUrl = `${appConfig.protocol}://${appConfig.host}:${appConfig.port}`;
appConfig.baseUrl = baseUrl;

export default appConfig;
