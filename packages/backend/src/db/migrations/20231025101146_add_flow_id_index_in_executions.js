export async function up(knex) {
  await knex.schema.table('executions', (table) => {
    table.index('flow_id');
  });
}

export async function down(knex) {
  await knex.schema.table('executions', (table) => {
    table.dropIndex('flow_id');
  });
}
