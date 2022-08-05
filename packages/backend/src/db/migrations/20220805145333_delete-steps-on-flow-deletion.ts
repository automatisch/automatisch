import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('steps', (table) => {
    table.dropForeign('flow_id');

    table
      .uuid('flow_id')
      .references('id')
      .inTable('flows')
      .onDelete('CASCADE')
      .alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('steps', (table) => {
    table.dropForeign('flow_id');

    table
      .uuid('flow_id')
      .references('id')
      .inTable('flows')
      .alter();
  });
}
