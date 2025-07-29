export async function up(knex) {
  return await knex.schema.alterTable('steps', (table) => {
    table.jsonb('branch_conditions');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('steps', (table) => {
    table.dropColumn('branch_conditions');
  });
}
