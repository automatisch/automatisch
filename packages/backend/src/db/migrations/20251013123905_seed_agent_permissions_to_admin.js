const getPermissionForRole = (roleId, subject, actions) =>
  actions.map((action) => ({
    role_id: roleId,
    subject,
    action,
    conditions: JSON.stringify([]),
  }));

export async function up(knex) {
  const role = await knex('roles')
    .first(['id', 'name'])
    .where({ name: 'Admin' })
    .limit(1);

  if (!role) return;

  await knex('permissions').insert(
    getPermissionForRole(role.id, 'Agent', ['read', 'manage'])
  );
}

export async function down(knex) {
  await knex('permissions').where({ subject: 'Agent' }).delete();
}
