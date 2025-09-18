export async function up(knex) {
  return knex.schema.createTable('mcp_servers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').references('id').inTable('users');
    table.string('name').notNullable();
    table.string('token').unique().notNullable();

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('mcp_servers');
}
