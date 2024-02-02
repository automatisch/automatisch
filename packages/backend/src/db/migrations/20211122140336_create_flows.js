export async function up(knex) {
  return knex.schema.createTable('flows', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name');
    table.uuid('user_id').references('id').inTable('users');

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('flows');
}
