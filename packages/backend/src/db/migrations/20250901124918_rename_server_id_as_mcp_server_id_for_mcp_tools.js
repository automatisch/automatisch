export async function up(knex) {
  return await knex.schema.alterTable('mcp_tools', (table) => {
    table.renameColumn('server_id', 'mcp_server_id');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('mcp_tools', (table) => {
    table.renameColumn('mcp_server_id', 'server_id');
  });
}
