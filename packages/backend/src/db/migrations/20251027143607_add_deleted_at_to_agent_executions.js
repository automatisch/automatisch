export async function up(knex) {
  return knex.schema.alterTable('agent_executions', (table) => {
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex) {
  return knex.schema.alterTable('agent_executions', (table) => {
    table.dropColumn('deleted_at');
  });
}
