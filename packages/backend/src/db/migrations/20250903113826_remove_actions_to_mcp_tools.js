export async function up(knex) {
  return await knex.schema.alterTable('mcp_tools', (table) => {
    table.dropColumn('actions');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('mcp_tools', (table) => {
    table.jsonb('actions').defaultTo([]);
  });
}
