import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('roles_permissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('role_id').references('id').inTable('roles');
    table.uuid('permission_id').references('id').inTable('permissions');
  });

  const roles = await knex('roles').select('id');
  const permissions = await knex('permissions').select('id');

  for (const role of roles) {
    for (const permission of permissions) {
      await knex('roles_permissions').insert({
        role_id: role.id,
        permission_id: permission.id,
      });
    }
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('roles_permissions');
}
