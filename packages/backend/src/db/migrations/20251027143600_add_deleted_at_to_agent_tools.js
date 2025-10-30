export async function up(knex) {
  return knex.schema.alterTable('agent_tools', (table) => {
    table.timestamp('deleted_at').nullable();
  });
}

export async function down(knex) {
  return knex.schema.alterTable('agent_tools', (table) => {
    table.dropColumn('deleted_at');
  });
}
