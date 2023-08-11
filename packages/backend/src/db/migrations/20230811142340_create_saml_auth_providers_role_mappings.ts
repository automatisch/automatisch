import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(
    'saml_auth_providers_role_mappings',
    (table) => {
      table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
      table
        .uuid('saml_auth_provider_id')
        .references('id')
        .inTable('saml_auth_providers');
      table.uuid('role_id').references('id').inTable('roles');
      table.string('remote_role_name').notNullable();

      table.unique(['saml_auth_provider_id', 'remote_role_name']);

      table.timestamps(true, true);
    }
  );
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('saml_auth_providers_role_mappings');
}
