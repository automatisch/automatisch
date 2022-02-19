import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('executions', (table) => {
    table.increments('id');
    table.integer('flow_id').references('id').inTable('flows');
    table.boolean('test_run').notNullable().defaultTo(false);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('executions');
}
