import { Model } from 'objection';
import { client as knex } from '@/config/database.js';
import logger from '@/helpers/logger.js';
import { vi } from 'vitest';
import nock from 'nock';
import './insert-assertions.js';

global.beforeAll(async () => {
  global.knex = null;
  logger.silent = true;

  // Remove default roles and permissions before running the test suite
  await knex.raw('TRUNCATE TABLE config CASCADE');
  await knex.raw('TRUNCATE TABLE roles CASCADE');
  await knex.raw('TRUNCATE TABLE permissions CASCADE');
});

global.beforeEach(async () => {
  // It's assigned as global.knex for the convenience even though
  // it's a transaction. It's rolled back after each test.
  // by assigning to knex, we can use it as knex.table('example') in tests files.
  global.knex = await knex.transaction();
  Model.knex(global.knex);
});

global.afterEach(async () => {
  await global.knex.rollback();
  Model.knex(knex);

  // Remove all API request mocks
  nock.cleanAll();

  vi.restoreAllMocks();
  vi.clearAllMocks();
});

global.afterAll(async () => {
  logger.silent = false;
});
