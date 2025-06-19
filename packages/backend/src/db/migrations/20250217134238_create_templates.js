export async function up(knex) {
  return knex.schema.createTable('templates', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name');
    table.jsonb('flow_data');

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('templates');
}
