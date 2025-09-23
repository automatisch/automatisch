export async function up(knex) {
  return knex.schema.createTable('mcp_tools', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('server_id').references('id').inTable('mcp_servers');
    table.string('type').defaultTo('app');
    table.uuid('flow_id').references('id').inTable('flows');
    table.uuid('connection_id').references('id').inTable('connections');
    table.string('app_key');
    table.jsonb('actions').defaultTo([]);

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('mcp_tools');
}
