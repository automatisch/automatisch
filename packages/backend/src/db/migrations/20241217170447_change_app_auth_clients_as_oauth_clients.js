export async function up(knex) {
  await knex.schema.renameTable('app_auth_clients', 'oauth_clients');

  await knex.schema.raw(
    'ALTER INDEX app_auth_clients_pkey RENAME TO oauth_clients_pkey'
  );

  await knex.schema.raw(
    'ALTER INDEX app_auth_clients_name_unique RENAME TO oauth_clients_name_unique'
  );

  return await knex.schema.alterTable('connections', (table) => {
    table.renameColumn('app_auth_client_id', 'oauth_client_id');
  });
}

export async function down(knex) {
  await knex.schema.renameTable('oauth_clients', 'app_auth_clients');

  await knex.schema.raw(
    'ALTER INDEX oauth_clients_pkey RENAME TO app_auth_clients_pkey'
  );

  await knex.schema.raw(
    'ALTER INDEX oauth_clients_name_unique RENAME TO app_auth_clients_name_unique'
  );

  return await knex.schema.alterTable('connections', (table) => {
    table.renameColumn('oauth_client_id', 'app_auth_client_id');
  });
}
