export async function up(knex) {
  const appAuthClients = await knex('app_auth_clients').select('*');

  for (const appAuthClient of appAuthClients) {
    const appConfig = await knex('app_configs')
      .where('id', appAuthClient.app_config_id)
      .first();

    await knex('app_auth_clients')
      .where('id', appAuthClient.id)
      .update({ app_key: appConfig.key });
  }
}

export async function down() {
  // void
}
