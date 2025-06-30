import { Knex } from 'knex';

const getPermission = (subject: string, actions: string[]) => actions.map(action => ({ subject, action }));

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('permissions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('action').notNullable();
    table.string('subject').notNullable();

    table.timestamps(true, true);
  });

  await knex('permissions').insert([
    ...getPermission('Connection', ['create', 'read', 'delete', 'update']),
    ...getPermission('Execution', ['read']),
    ...getPermission('Flow', ['create', 'delete', 'publish', 'read', 'update']),
    ...getPermission('Role', ['create', 'delete', 'read', 'update']),
    ...getPermission('User', ['create', 'delete', 'read', 'update']),
  ]);
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('permissions');
}
