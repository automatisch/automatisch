export async function up(knex) {
  return await knex.schema.alterTable('mcp_tools', (table) => {
    table.string('action');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('mcp_tools', (table) => {
    table.dropColumn('action');
  });
}
