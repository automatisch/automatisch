export async function up(knex) {
  return knex.schema.alterTable('steps', (table) => {
    table.jsonb('parameters').defaultTo('{}').alter();
  });
}

export async function down(knex) {
  return knex.schema.alterTable('steps', (table) => {
    table.text('parameters').alter();
  });
}
