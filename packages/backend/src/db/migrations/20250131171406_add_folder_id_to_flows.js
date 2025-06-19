export async function up(knex) {
  await knex.schema.table('flows', (table) => {
    table.uuid('folder_id').references('id').inTable('folders').index();
  });
}

export async function down(knex) {
  await knex.schema.table('flows', (table) => {
    table.dropIndex('folder_id');
    table.dropColumn('folder_id');
  });
}
