import knex from 'knex';

const getClient = ($) => {
  const client = knex({
    client: 'mssql',
    connection: {
      server: $.auth.data.host,
      port: Number($.auth.data.port),
      user: $.auth.data.user,
      password: $.auth.data.password,
      database: $.auth.data.database,
      options: {
        encrypt:
          $.auth.data.enableSsl === 'true' || $.auth.data.enableSsl === true,
        trustServerCertificate: true,
      },
    },
  });

  return client;
};

export default getClient;
