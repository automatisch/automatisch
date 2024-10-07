export async function up(knex) {
  await knex.schema.alterTable('app_configs', (table) => {
    table.boolean('can_connect').defaultTo(false);
  });

  const appConfigs = await knex('app_configs').select('*');

  for (const appConfig of appConfigs) {
    const appAuthClients = await knex('app_auth_clients').where(
      'app_key',
      appConfig.key
    );

    const hasSomeActiveAppAuthClients = !!appAuthClients?.some(
      (appAuthClient) => appAuthClient.active
    );
    const shared = appConfig.shared;
    const active = appConfig.disabled === false;

    const canConnectConditions = [hasSomeActiveAppAuthClients, shared, active];
    const canConnect = canConnectConditions.every(Boolean);

    await knex('app_configs')
      .where('id', appConfig.id)
      .update({ can_connect: canConnect });
  }
}

export async function down(knex) {
  await knex.schema.alterTable('app_configs', (table) => {
    table.dropColumn('can_connect');
  });
}
