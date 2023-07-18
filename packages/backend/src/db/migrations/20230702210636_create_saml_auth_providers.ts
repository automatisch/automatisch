import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('saml_auth_providers', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.string('name').notNullable();
    table.text('certificate').notNullable();
    table.string('signature_algorithm').notNullable();
    table.string('issuer').notNullable();
    table.text('entry_point').notNullable();
    table.text('firstname_attribute_name').notNullable();
    table.text('surname_attribute_name').notNullable();
    table.text('email_attribute_name').notNullable();
    table.text('role_attribute_name').notNullable();
    table.uuid('default_role_id').references('id').inTable('roles');
    table.boolean('active').defaultTo(false);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('saml_auth_providers');
}
