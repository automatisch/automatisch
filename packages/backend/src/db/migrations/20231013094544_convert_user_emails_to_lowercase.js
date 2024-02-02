export async function up(knex) {
  await knex('users')
    .whereRaw('email != LOWER(email)')
    .update({
      email: knex.raw('LOWER(email)'),
    });
}

export async function down() {
  // void
}
