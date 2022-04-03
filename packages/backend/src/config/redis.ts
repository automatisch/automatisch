import appConfig from './app';

const redisConfig = {
  host: appConfig.redisHost,
  port: appConfig.redisPort,
  enableOfflineQueue: false,
};

export default redisConfig;
