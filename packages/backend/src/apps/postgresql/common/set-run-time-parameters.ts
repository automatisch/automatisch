import { Knex } from 'knex';
import { IGlobalVariable, IJSONObject } from '@automatisch/types';

const setParams = async ($: IGlobalVariable, client: Knex<any, unknown[]>): Promise<Knex.Raw<any>> => {

  const params: any = $.step.parameters.params
  let paramsObj: IJSONObject = {}
  params.forEach((ele: any) => { paramsObj[ele.configParam] = ele.value })

  for (const key in paramsObj) {
    const res = await client.raw(`SET ${key} = '${paramsObj[key]}'`);
  }

};

export default setParams;
