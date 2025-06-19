import { Knex } from 'knex';
import capitalize from 'lodash/capitalize';
import lowerCase from 'lodash/lowerCase';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('roles', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.string('key').notNullable();
    table.string('description');

    table.timestamps(true, true);
  });

  const uniqueUserRoles = await knex('users')
    .select('role')
    .groupBy('role');

  for (const { role } of uniqueUserRoles) {
    // skip empty roles
    if (!role) continue;

    await knex('roles').insert({
      name: capitalize(role),
      key: lowerCase(role),
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('roles');
}
