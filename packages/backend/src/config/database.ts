import process from 'process';
import knex from 'knex';
import type { Knex } from 'knex';
import knexConfig from '../../knexfile';
import logger from '../helpers/logger';

export const client: Knex = knex(knexConfig);

const CONNECTION_REFUSED = 'ECONNREFUSED';

client.raw('SELECT 1')
  .catch((err) => {
    if (err.code === CONNECTION_REFUSED) {
      logger.error('Make sure you have installed PostgreSQL and it is running.', err);
      process.exit();
    }
  });
