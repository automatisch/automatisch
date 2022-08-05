import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('executions', (table) => {
      table.dropForeign('flow_id');

      table
        .uuid('flow_id')
        .references('id')
        .inTable('flows')
        .onDelete('CASCADE')
        .alter();
    })
    .alterTable('execution_steps', (table) => {
      table.dropForeign('execution_id');

      table
        .uuid('execution_id')
        .references('id')
        .inTable('executions')
        .onDelete('CASCADE')
        .alter();

      table.dropForeign('step_id');

      table
        .uuid('step_id')
        .references('id')
        .inTable('steps')
        .onDelete('CASCADE')
        .alter();
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable('executions', (table) => {
      table.dropForeign('flow_id');

      table
        .uuid('flow_id')
        .references('id')
        .inTable('flows')
        .alter();
    })
    .alterTable('execution_steps', (table) => {
      table.dropForeign('execution_id');

      table
        .uuid('execution_id')
        .references('id')
        .inTable('executions')
        .alter();

      table.dropForeign('step_id');

      table
        .uuid('step_id')
        .references('id')
        .inTable('steps')
        .alter();
    });
}
