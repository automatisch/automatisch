export async function up(knex) {
  return knex.schema.alterTable('mcp_tools', (table) => {
    table.unique(['mcp_server_id', 'action']);
  });
}

export async function down(knex) {
  return knex.schema.alterTable('mcp_tools', (table) => {
    table.dropUnique(['mcp_server_id', 'action']);
  });
}
