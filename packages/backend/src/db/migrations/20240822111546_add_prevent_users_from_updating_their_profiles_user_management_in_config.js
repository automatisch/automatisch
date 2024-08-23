export async function up(knex) {
  await knex('config').insert({
    key: 'userManagement.preventUsersFromUpdatingTheirProfile',
    value: {
      data: false
    }
  });
};

export async function down(knex) {
  await knex('config').where({ key: 'userManagement.preventUsersFromUpdatingTheirProfile' }).delete();
};
