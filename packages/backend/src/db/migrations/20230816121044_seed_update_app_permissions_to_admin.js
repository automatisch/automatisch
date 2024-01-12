const getPermissionForRole = (roleId, subject, actions) =>
  actions.map((action) => ({
    role_id: roleId,
    subject,
    action,
    conditions: [],
  }));

export async function up(knex) {
  const role = await knex('roles')
    .first(['id', 'key'])
    .where({ key: 'admin' })
    .limit(1);

  await knex('permissions').insert(
    getPermissionForRole(role.id, 'App', ['create', 'read', 'delete', 'update'])
  );
}

export async function down(knex) {
  await knex('permissions').where({ subject: 'App' }).delete();
}
