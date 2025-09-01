export async function up(knex) {
  return knex.schema.table('mcp_tool_executions', (table) => {
    table.jsonb('error_details');
  });
}

export async function down(knex) {
  return knex.schema.table('mcp_tool_executions', (table) => {
    table.dropColumn('error_details');
  });
}
