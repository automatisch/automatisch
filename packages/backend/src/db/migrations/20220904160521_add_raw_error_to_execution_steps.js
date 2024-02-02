export async function up(knex) {
  return knex.schema.table('execution_steps', (table) => {
    table.jsonb('error_details');
  });
}

export async function down(knex) {
  return knex.schema.table('execution_steps', (table) => {
    table.dropColumn('error_details');
  });
}
