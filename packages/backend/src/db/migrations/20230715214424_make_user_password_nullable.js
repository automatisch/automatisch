export async function up(knex) {
  return await knex.schema.alterTable('users', (table) => {
    table.string('password').nullable().alter();
  });
}

export async function down() {
  // void
}
