import { Knex } from 'knex';
import { Transaction } from 'objection';

declare global {
  declare namespace globalThis {
    // eslint-disable-next-line no-var
    var knexInstance: Knex;
    // eslint-disable-next-line no-var
    var knex: Transaction;
  }
}
