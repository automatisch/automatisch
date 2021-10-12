import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('credentials', (table) => {
    table.increments('id');
    table.string('key').notNullable();
    table.string('display_name').notNullable();
    table.text('data').notNullable();
    table.integer('user_id').references('id').inTable('users');
    table.boolean('verified').defaultTo(false);

    table.timestamps(true, true);
  });
};

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('credentials');
}
