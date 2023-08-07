import { Knex } from 'knex';

const getPermissionForRole = (
  roleId: string,
  subject: string,
  actions: string[]
) =>
  actions.map((action) => ({
    role_id: roleId,
    subject,
    action,
    conditions: [],
  }));

export async function up(knex: Knex): Promise<void> {
  const role = (await knex('roles')
    .first(['id', 'key'])
    .where({ key: 'admin' })
    .limit(1)) as { id: string; key: string };

  await knex('permissions').insert(
    getPermissionForRole(role.id, 'SamlAuthProvider', [
      'create',
      'read',
      'delete',
      'update',
    ])
  );
}

export async function down(knex: Knex): Promise<void> {
  await knex('permissions').where({ subject: 'SamlAuthProvider' }).delete();
}
