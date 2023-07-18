import { Knex } from 'knex';

const getPermissionForRole = (roleId: string, subject: string, actions: string[], conditions: string[] = []) => actions
  .map(action => ({
    role_id: roleId,
    subject,
    action,
    conditions,
  }));

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('permissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('role_id').references('id').inTable('roles');
    table.string('action').notNullable();
    table.string('subject').notNullable();
    table.jsonb('conditions').notNullable().defaultTo([]);

    table.timestamps(true, true);
  });

  const roles = await knex('roles').select(['id', 'key']) as { id: string, key: string }[];

  for (const role of roles) {
    // `admin` role should have no conditions unlike others by default
    const isAdmin = role.key === 'admin';
    const roleConditions = isAdmin ? [] : ['isCreator'];

    // default permissions
    await knex('permissions').insert([
      ...getPermissionForRole(role.id, 'Connection', ['create', 'read', 'delete', 'update'], roleConditions),
      ...getPermissionForRole(role.id, 'Execution', ['read'], roleConditions),
      ...getPermissionForRole(role.id, 'Flow', ['create', 'delete', 'publish', 'read', 'update'], roleConditions),
    ]);

    // admin specific permission
    if (isAdmin) {
      await knex('permissions').insert([
        ...getPermissionForRole(role.id, 'User', ['create', 'read', 'delete', 'update']),
        ...getPermissionForRole(role.id, 'Role', ['create', 'read', 'delete', 'update']),
      ]);
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('permissions');
}
