export async function up(knex) {
  return knex.schema.table('steps', (table) => {
    table.uuid('flow_id').references('id').inTable('flows');
  });
}

export async function down(knex) {
  return knex.schema.table('steps', (table) => {
    table.dropColumn('flow_id');
  });
}
