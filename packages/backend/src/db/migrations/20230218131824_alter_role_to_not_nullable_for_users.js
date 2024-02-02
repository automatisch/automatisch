export async function up(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('role').notNullable().alter();
  });
}

export async function down(knex) {
  return knex.schema.alterTable('users', (table) => {
    table.string('role').nullable().alter();
  });
}
