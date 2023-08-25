import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('app_configs', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('key').unique().notNullable();
    table.boolean('allow_custom_connection').notNullable().defaultTo(false);
    table.boolean('shared').notNullable().defaultTo(false);
    table.boolean('disabled').notNullable().defaultTo(false);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('app_configs');
}
