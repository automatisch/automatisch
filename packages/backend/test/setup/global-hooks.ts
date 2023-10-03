import { transaction, Model } from 'objection';
import { client as knex } from '../../src/config/database';
import logger from '../../src/helpers/logger';

global.beforeAll(async () => {
  global.knexInstance = knex;
  global.knex = null;
  logger.silent = true;
});

global.beforeEach(async () => {
  // It's assigned as global.knex for the convenience even though
  // it's a transaction. It's rolled back after each test.
  // by assigning to knex, we can use it as knex.table('example') in tests files.
  global.knex = await transaction.start(knex);
  Model.knex(global.knex);
});

global.afterEach(async () => {
  await global.knex.rollback();
  Model.knex(knex);
});

global.afterAll(async () => {
  global.knexInstance.destroy();
  logger.silent = false;
});
