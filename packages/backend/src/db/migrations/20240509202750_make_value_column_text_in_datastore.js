export async function up(knex) {
  return knex.schema.alterTable('datastore', (table) => {
    table.text('value').alter();
  });
}

export async function down(knex) {
  return knex.schema.alterTable('datastore', (table) => {
    table.string('value').alter();
  });
}
