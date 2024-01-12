export async function up(knex) {
  await knex.schema.table('executions', (table) => {
    table.index('updated_at');
  });
}

export async function down(knex) {
  await knex.schema.table('executions', (table) => {
    table.dropIndex('updated_at');
  });
}
