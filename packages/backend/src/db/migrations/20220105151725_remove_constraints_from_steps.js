export async function up(knex) {
  return knex.schema.alterTable('steps', (table) => {
    table.string('key').nullable().alter();
    table.string('app_key').nullable().alter();
  });
}

export async function down(knex) {
  return knex.schema.alterTable('steps', (table) => {
    table.string('key').notNullable().alter();
    table.string('app_key').notNullable().alter();
  });
}
