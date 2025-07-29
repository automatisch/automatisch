export async function up(knex) {
  return await knex.schema.alterTable('steps', (table) => {
    table.renameColumn('step_type', 'structural_type');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('steps', (table) => {
    table.renameColumn('structural_type', 'step_type');
  });
}
