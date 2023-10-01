import { Knex } from 'knex';

declare global {
  declare namespace globalThis {
    // eslint-disable-next-line no-var
    var knex: Knex;
  }
}
