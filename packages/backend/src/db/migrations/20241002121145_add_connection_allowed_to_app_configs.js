export async function up(knex) {
  await knex.schema.alterTable('app_configs', (table) => {
    table.boolean('connection_allowed').defaultTo(false);
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

    const connectionAllowedConditions = [
      hasSomeActiveAppAuthClients,
      shared,
      active,
    ];
    const connectionAllowed = connectionAllowedConditions.every(Boolean);

    await knex('app_configs')
      .where('id', appConfig.id)
      .update({ connection_allowed: connectionAllowed });
  }
}

export async function down(knex) {
  await knex.schema.alterTable('app_configs', (table) => {
    table.dropColumn('connection_allowed');
  });
}
