import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('execution_steps', (table) => {
    table.increments('id');
    table.integer('execution_id').references('id').inTable('executions');
    table.integer('step_id').references('id').inTable('steps');
    table.string('status');
    table.text('data_in');
    table.text('data_out');

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('execution_steps');
}
