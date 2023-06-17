import {IGlobalVariable} from '@automatisch/types';
import {authenticate} from '../async-XMLRPC-client';

const verifyCredentials = async ($: IGlobalVariable) => {
  await authenticate($);

  await $.auth.set({
    screenName: `${$.auth.data.hostName} - ${$.auth.data.databaseName} - ${$.auth.data.email}`,
  });
}

export default verifyCredentials;
