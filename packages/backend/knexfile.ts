import appConfig from './src/config/app';

const knexConfig = {
  client: 'pg',
  connection: {
    host: appConfig.postgresHost,
    port: appConfig.postgresPort,
    user: appConfig.postgresUsername,
    password: appConfig.postgresPassword,
    database: appConfig.postgresDatabase,
  },
  migrations: {
    directory: __dirname + '/db/migrations',
  },
  seeds: {
    directory: __dirname + '/db/seeds',
  }
}

export default knexConfig;
