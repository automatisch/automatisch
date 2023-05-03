import { IGlobalVariable } from '@automatisch/types';
import knex, { Knex } from 'knex'


const setConfig = async ($: IGlobalVariable) : Promise<Knex<any, unknown[]>> => {
  const pgClient = knex({
    client: 'pg',
    version: $.auth.data.version as string,
    connection: {
        host : $.auth.data.host as string,
        port : $.auth.data.port as number,
        user : $.auth.data.user as string,
        password : $.auth.data.password as string,
        database : $.auth.data.database as string
      }
    })

  return pgClient;

};

export default setConfig;
