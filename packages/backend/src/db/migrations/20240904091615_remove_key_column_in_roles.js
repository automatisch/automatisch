export async function up(knex) {
  return await knex.schema.alterTable('roles', (table) => {
    table.dropColumn('key');
  });
}

export async function down(knex) {
  await knex.schema.alterTable('roles', (table) => {
    table.string('key');
  });

  await knex('roles').update({
    key: knex.raw('LOWER(??)', ['name']),
  });

  return await knex.schema.alterTable('roles', (table) => {
    table.string('key').notNullable().alter();
  });
}
