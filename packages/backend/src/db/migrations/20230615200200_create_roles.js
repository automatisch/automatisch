import capitalize from 'lodash/capitalize.js';
import lowerCase from 'lodash/lowerCase.js';

export async function up(knex) {
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('key').notNullable();
    table.string('description');

    table.timestamps(true, true);
  });

  const uniqueUserRoles = await knex('users').select('role').groupBy('role');

  let shouldCreateAdminRole = true;
  for (const { role } of uniqueUserRoles) {
    // skip empty roles
    if (!role) continue;

    const lowerCaseRole = lowerCase(role);

    if (lowerCaseRole === 'admin') {
      shouldCreateAdminRole = false;
    }

    await knex('roles').insert({
      name: capitalize(role),
      key: lowerCaseRole,
    });
  }

  if (shouldCreateAdminRole) {
    await knex('roles').insert({
      name: 'Admin',
      key: 'admin',
    });
  }
}

export async function down(knex) {
  return knex.schema.dropTable('roles');
}
