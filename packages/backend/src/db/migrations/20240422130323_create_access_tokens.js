export async function up(knex) {
  return knex.schema.createTable('access_tokens', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('token').notNullable();
    table.integer('expires_in').notNullable();
    table.timestamp('revoked_at').nullable();
    table.uuid('user_id').references('id').inTable('users');

    table.timestamps(true, true);
  });
}

export async function down(knex) {
  return knex.schema.dropTable('access_tokens');
}
