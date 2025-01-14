export async function up(knex) {
  return await knex.schema.alterTable('app_configs', (table) => {
    table.dropColumn('shared');
    table.dropColumn('connection_allowed');
    table.dropColumn('custom_connection_allowed');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('app_configs', (table) => {
    table.boolean('shared').defaultTo(false);
    table.boolean('connection_allowed').defaultTo(false);
    table.boolean('custom_connection_allowed').defaultTo(false);
  });
}
