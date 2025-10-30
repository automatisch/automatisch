import { client as knex } from '@/config/database.js';

export async function setup() {
  // Remove default roles and permissions before running the test suite
  await knex.raw('TRUNCATE TABLE config CASCADE');
  await knex.raw('TRUNCATE TABLE roles CASCADE');
  await knex.raw('TRUNCATE TABLE permissions CASCADE');
}

export async function teardown() {
  // Close database connection pool after all tests
  await knex.destroy();
}
