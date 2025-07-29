export async function up(knex) {
  return await knex.schema.alterTable('steps', (table) => {
    table.uuid('parent_step_id').nullable();
    table.foreign('parent_step_id').references('id').inTable('steps').onDelete('CASCADE');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('steps', (table) => {
    table.dropForeign('parent_step_id');
    table.dropColumn('parent_step_id');
  });
}
