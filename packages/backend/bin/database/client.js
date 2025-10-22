import pg from 'pg';
import appConfig from '../../src/config/app.js';

const client = new pg.Client({
  host: appConfig.postgresHost,
  user: appConfig.postgresUsername,
  password: appConfig.postgresPassword,
  port: appConfig.postgresPort,
});

export default client;
