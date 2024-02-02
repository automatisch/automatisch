import appConfig from './app.js';

const redisConfig = {
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
