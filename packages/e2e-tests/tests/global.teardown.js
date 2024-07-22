const { publicTest } = require('../fixtures');
import knex from 'knex';
import knexConfig from '../knexfile.js';

publicTest.describe('restore db', () => {
    publicTest('clean db and perform migrations', async () => {
      const knexClient = knex(knexConfig)
      const migrator = knexClient.migrate;
      await migrator.rollback({}, true);
      await migrator.latest();
    })
});
