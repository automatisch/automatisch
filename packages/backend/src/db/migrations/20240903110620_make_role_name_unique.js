export async function up(knex) {
  return await knex.schema.alterTable('roles', (table) => {
    table.unique('name');
  });
}

export async function down(knex) {
  return await knex.schema.alterTable('roles', function (table) {
    table.dropUnique('name');
  });
}
