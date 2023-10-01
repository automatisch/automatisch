import { client as knex } from '../../src/config/database';

global.beforeAll(async () => {
  global.knex = knex;
});

global.beforeEach(async function () {
  this.transaction = await global.knex.transaction();
});

global.afterEach(async function () {
  await this.transaction.rollback();
});

global.afterAll(async () => {
  global.knex.destroy();
});
