export async function up(knex) {
  return knex.schema.alterTable('agents', (table) => {
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex) {
  return knex.schema.alterTable('agents', (table) => {
    table.dropColumn('deleted_at');
  });
}
