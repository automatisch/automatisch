export async function up(knex) {
  return knex.schema.createTable('api_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('token').notNullable().index();

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('api_tokens');
}
