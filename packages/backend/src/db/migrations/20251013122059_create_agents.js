export async function up(knex) {
  return await knex.schema.createTable('agents', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name');
    table.string('description');
    table.text('instructions');

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return await knex.schema.dropTable('agents');
}
