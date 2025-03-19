export async function up(knex) {
  return await knex.schema.table('executions', (table) => {
    table.index('created_at');
  });
}

export async function down(knex) {
  return await knex.schema.table('executions', (table) => {
    table.dropIndex('created_at');
  });
}
