import { Knex } from 'knex';
import { type IJSONValue } from '@automatisch/types';

type TParams = { parameter: string; value: string; }[];

const setParams = async (client: Knex<any, unknown[]>, params: IJSONValue = []): Promise<void> => {
  for (const { parameter, value } of (params as TParams)) {
    if (parameter) {
      const bindings = {
        parameter,
        value,
      };

      await client.raw('SET :parameter: = :value:', bindings);
    }
  }
};

export default setParams;
