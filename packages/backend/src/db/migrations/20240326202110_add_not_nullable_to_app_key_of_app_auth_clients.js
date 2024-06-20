export async function up(knex) {
  await knex.schema.table('app_auth_clients', (table) => {
    table.string('app_key').notNullable().alter();
  });
}

export async function down(knex) {
  await knex.schema.table('app_auth_clients', (table) => {
    table.string('app_key').nullable().alter();
  });
}
