export async function up(knex) {
  return knex.schema.renameTable('credentials', 'connections');
}

export async function down(knex) {
  return knex.schema.renameTable('connections', 'credentials');
}
