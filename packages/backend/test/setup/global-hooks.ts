import { client as knex } from '../../src/config/database';
import { Knex } from 'knex';

global.beforeAll(async () => {
  (global as any).knex = knex as Knex;
});

global.beforeEach(async function () {
  this.transaction = await (global as any).knex.transaction();
});

global.afterEach(async function () {
  await this.transaction.rollback();
});

global.afterAll(async () => {
  (global as any).knex.destroy();
});
