import appConfig from './app';

const redisConfig = {
  host: appConfig.redisHost,
  port: appConfig.redisPort,
};

export default redisConfig;
