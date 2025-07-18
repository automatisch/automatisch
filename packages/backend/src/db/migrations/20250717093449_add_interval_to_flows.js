export async function up(knex) {
  return await knex.schema.alterTable('flows', (table) => {
    table.integer('execution_interval').defaultTo(15);
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('flows', (table) => {
    table.dropColumn('execution_interval');
  });
}
