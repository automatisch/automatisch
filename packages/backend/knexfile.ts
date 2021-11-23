import appConfig from './src/config/app';

const knexConfig = {
  client: 'pg',
  connection: {
    host: appConfig.postgresHost,
    port: appConfig.postgresPort,
    user: appConfig.postgresUsername,
    password: appConfig.postgresPassword,
    database: appConfig.postgresDatabase,
    ssl: appConfig.postgresEnableSsl
  },
  migrations: {
    directory: __dirname + '/src/db/migrations',
  },
  seeds: {
    directory: __dirname + '/src/db/seeds',
  }
}

export default knexConfig;
