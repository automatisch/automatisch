import knex, { Knex } from 'knex';
import { IGlobalVariable } from '@automatisch/types';

const getClient = ($: IGlobalVariable): Knex<any, unknown[]> => {
  const pgClient = knex({
    client: 'pg',
    version: $.auth.data.version as string,
    connection: {
      host: $.auth.data.host as string,
      port: Number($.auth.data.port),
      user: $.auth.data.user as string,
      password: $.auth.data.password as string,
      database: $.auth.data.database as string,
    }
  })

  return pgClient;
};

export default getClient;
