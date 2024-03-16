export async function up(knex) {
  return knex.schema.createTable('datastore', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('key').notNullable();
    table.string('value');
    table.string('scope').notNullable();
    table.uuid('scope_id').notNullable();
    table.index(['key', 'scope', 'scope_id']);

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('datastore');
}
