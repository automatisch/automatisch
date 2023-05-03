// import { IGlobalVariable } from '@automatisch/types';
// import verifyCredentials from './verify-credentials';
// import { Knex } from 'knex';

// const isStillVerified = async ($: IGlobalVariable) => {

//     await $.auth.data.pgClient.raw('SELECT 1')
// //   await verifyCredentials($);
//   return true;
// };

// export default isStillVerified;

import { IGlobalVariable } from '@automatisch/types';
import verifyCredentials from './verify-credentials';

const isStillVerified = async ($: IGlobalVariable) => {
  await verifyCredentials($);
  return true;
};

export default isStillVerified;
