export async function up(knex) {
  await knex.schema.table('agents', (table) => {
    table.uuid('user_id').references('id').inTable('users');
  });
}

export async function down(knex) {
  await knex.schema.table('agents', (table) => {
    table.dropColumn('user_id');
  });
}
