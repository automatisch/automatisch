import { Knex } from 'knex';

declare global {
  declare namespace globalThis {
    var knex: Knex;
  }
}
