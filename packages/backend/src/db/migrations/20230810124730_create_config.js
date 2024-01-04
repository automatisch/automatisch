export async function up(knex) {
  return knex.schema.createTable('config', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('key').unique().notNullable();
    table.jsonb('value').notNullable().defaultTo({});

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('config');
}
