export async function up(knex) {
  return await knex.schema.alterTable('steps', (table) => {
    table.string('step_type').defaultTo('single');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('steps', (table) => {
    table.dropColumn('step_type');
  });
}
