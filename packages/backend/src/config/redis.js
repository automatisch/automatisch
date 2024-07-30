import appConfig from './app.js';

const redisConfig = {
  username: appConfig.redisUsername,
  password: appConfig.redisPassword,
  db: appConfig.redisDb,
  enableOfflineQueue: false,
  enableReadyCheck: true,
};

if (appConfig.redisSentinelHost) {
  redisConfig.sentinels = [
    {
      host: appConfig.redisSentinelHost,
      port: appConfig.redisSentinelPort,
    }
  ];

  redisConfig.sentinelUsername = appConfig.redisSentinelUsername;
  redisConfig.sentinelPassword = appConfig.redisSentinelPassword;
  redisConfig.name = appConfig.redisName;
  redisConfig.role = appConfig.redisRole;
} else {
  redisConfig.host = appConfig.redisHost;
  redisConfig.port = appConfig.redisPort;
}

if (appConfig.redisTls) {
  redisConfig.tls = {};
}

export default redisConfig;
