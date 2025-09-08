export async function up(knex) {
  await knex.schema.createTable('mcp_sessions', (t) => {
    t.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    t.uuid('mcp_server_id')
      .notNullable()
      .references('id')
      .inTable('mcp_servers');
    t.timestamps(true, true);
    t.index(['mcp_server_id']);
  });
}

export async function down(knex) {
  await knex.schema.dropTable('mcp_sessions');
}
