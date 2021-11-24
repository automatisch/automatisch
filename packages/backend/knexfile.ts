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
  pool: { min: 0, max: 20 },
  migrations: {
    directory: __dirname + '/src/db/migrations',
  },
  seeds: {
    directory: __dirname + '/src/db/seeds',
  }
}

export default knexConfig;
