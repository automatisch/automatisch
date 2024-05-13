export async function up(knex) {
  const users = await knex('users').limit(1);

  // no user implies installation is not completed yet.
  if (users.length === 0) return;

  await knex('config').insert({
    key: 'installation.completed',
    value: {
      data: true
    }
  });
};

export async function down(knex) {
  await knex('config').where({ key: 'installation.completed' }).delete();
};
