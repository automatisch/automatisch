export async function up(knex) {
  return knex.schema.createTable('mcp_tool_executions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('mcp_tool_id').references('id').inTable('mcp_tools');
    table.string('status');
    table.text('data_in');
    table.text('data_out');

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('mcp_tool_executions');
}
