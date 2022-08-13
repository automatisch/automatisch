import process from 'process';
// The following two lines are required to get count values as number.
// More info: https://github.com/knex/knex/issues/387#issuecomment-51554522
import pg from 'pg';
pg.types.setTypeParser(20, 'text', parseInt);
import knex from 'knex';
import type { Knex } from 'knex';
import knexConfig from '../../knexfile';
import logger from '../helpers/logger';

export const client: Knex = knex(knexConfig);

const CONNECTION_REFUSED = 'ECONNREFUSED';

client.raw('SELECT 1').catch((err) => {
  if (err.code === CONNECTION_REFUSED) {
    logger.error(
      'Make sure you have installed PostgreSQL and it is running.',
      err
    );
    process.exit();
  }
});
