export async function up(knex) {
  return knex.schema.table('executions', (table) => {
    table.string('internal_id');
  });
}

export async function down(knex) {
  return knex.schema.table('executions', (table) => {
    table.dropColumn('internal_id');
  });
}
