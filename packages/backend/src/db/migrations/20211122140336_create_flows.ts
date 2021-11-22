import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('flows', (table) => {
    table.increments('id');
    table.string('name');
    table.integer('user_id').references('id').inTable('users');

    table.timestamps(true, true);
  });
};

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('flows');
}
