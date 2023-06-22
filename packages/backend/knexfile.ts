import appConfig from './src/config/app';

const fileExtension = appConfig.isDev ? 'ts' : 'js';

const knexConfig = {
  client: 'pg',
  connection: {
    host: appConfig.postgresHost,
    port: appConfig.postgresPort,
    user: appConfig.postgresUsername,
    password: appConfig.postgresPassword,
    database: appConfig.postgresDatabase,
    ssl: appConfig.postgresEnableSsl,
  },
  asyncStackTraces: appConfig.isDev,
  searchPath: [appConfig.postgresSchema],
  pool: { min: 0, max: 20 },
  migrations: {
    directory: __dirname + '/src/db/migrations',
    extension: fileExtension,
    loadExtensions: [`.${fileExtension}`],
  },
  seeds: {
    directory: __dirname + '/src/db/seeds',
  },
};

export default knexConfig;
