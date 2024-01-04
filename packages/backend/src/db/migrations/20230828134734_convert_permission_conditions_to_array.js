export async function up(knex) {
  await knex('permissions')
    .where(knex.raw('conditions::text'), '=', knex.raw("'{}'::text"))
    .update('conditions', JSON.stringify([]));
}

export async function down() {
  // void
}
