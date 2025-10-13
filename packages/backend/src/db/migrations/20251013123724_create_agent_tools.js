export async function up(knex) {
  return knex.schema.createTable('agent_tools', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('agent_id').references('id').inTable('agents');
    table.string('type').defaultTo('app');
    table.uuid('flow_id').references('id').inTable('flows');
    table.uuid('connection_id').references('id').inTable('connections');
    table.string('app_key');
    table.jsonb('actions').defaultTo([]);

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('agent_tools');
}
