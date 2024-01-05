import knex from 'knex';

const getClient = ($) => {
  const client = knex({
    client: 'pg',
    version: $.auth.data.version,
    connection: {
      host: $.auth.data.host,
      port: Number($.auth.data.port),
      ssl: $.auth.data.enableSsl === 'true' || $.auth.data.enableSsl === true,
      user: $.auth.data.user,
      password: $.auth.data.password,
      database: $.auth.data.database,
    },
  });

  return client;
};

export default getClient;
