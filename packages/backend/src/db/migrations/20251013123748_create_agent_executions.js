export async function up(knex) {
  return knex.schema.createTable('agent_executions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('agent_id').references('id').inTable('agents');
    table.text('prompt');
    table.text('output');
    table.string('status');
    table.timestamp('finished_at');

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('agent_executions');
}
