import appConfig from './app';

type TRedisConfig = {
  host: string,
  port: number,
  username?: string,
  password?: string,
  tls?: Record<string, unknown>,
  enableReadyCheck?: boolean,
  enableOfflineQueue: boolean,
}

const redisConfig: TRedisConfig = {
  host: appConfig.redisHost,
  port: appConfig.redisPort,
  username: appConfig.redisUsername,
  password: appConfig.redisPassword,
  enableOfflineQueue: false,
  enableReadyCheck: true,
};

if (appConfig.redisTls) {
  redisConfig.tls = {};
}

export default redisConfig;
