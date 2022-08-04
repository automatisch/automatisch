import * as dotenv from 'dotenv';
dotenv.config();

type AppConfig = {
  host: string;
  protocol: string;
  port: string;
  webAppUrl: string;
  appEnv: string;
  isDev: boolean;
  postgresDatabase: string;
  postgresPort: number;
  postgresHost: string;
  postgresUsername: string;
  postgresPassword?: string;
  version: string;
  postgresEnableSsl: boolean;
  baseUrl: string;
  encryptionKey: string;
  appSecretKey: string;
  serveWebAppSeparately: boolean;
  redisHost: string;
  redisPort: number;
  enableBullMQDashboard: boolean;
};

const host = process.env.HOST || 'localhost';
const protocol = process.env.PROTOCOL || 'http';
const port = process.env.PORT || '3000';
const serveWebAppSeparately =
  process.env.SERVE_WEB_APP_SEPARATELY === 'true' ? true : false;

let webAppUrl = `${protocol}://${host}:${port}`;
if (serveWebAppSeparately) {
  webAppUrl = process.env.WEB_APP_URL || 'http://localhost:3001';
}

const baseUrl = `${protocol}://${host}:${port}`;

const appEnv = process.env.APP_ENV || 'development';

const appConfig: AppConfig = {
  host,
  protocol,
  port,
  appEnv: appEnv,
  isDev: appEnv === 'development',
  version: process.env.npm_package_version,
  postgresDatabase: process.env.POSTGRES_DATABASE || 'automatisch_development',
  postgresPort: parseInt(process.env.POSTGRES_PORT || '5432'),
  postgresHost: process.env.POSTGRES_HOST || 'localhost',
  postgresUsername:
    process.env.POSTGRES_USERNAME || 'automatisch_development_user',
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresEnableSsl: process.env.POSTGRES_ENABLE_SSL === 'true' ? true : false,
  encryptionKey: process.env.ENCRYPTION_KEY || '',
  appSecretKey: process.env.APP_SECRET_KEY || '',
  serveWebAppSeparately,
  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: parseInt(process.env.REDIS_PORT || '6379'),
  enableBullMQDashboard:
    process.env.ENABLE_BULLMQ_DASHBOARD === 'true' ? true : false,
  baseUrl,
  webAppUrl,
};

if (!appConfig.encryptionKey) {
  throw new Error('ENCRYPTION_KEY environment variable needs to be set!');
}

export default appConfig;
