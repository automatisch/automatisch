import process from 'process';
// The following two lines are required to get count values as number.
// More info: https://github.com/knex/knex/issues/387#issuecomment-51554522
import pg from 'pg';
pg.types.setTypeParser(20, 'text', parseInt);
import knex from 'knex';
import knexConfig from '../../knexfile.js';
import logger from '../helpers/logger.js';

export const client = knex(knexConfig);

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
