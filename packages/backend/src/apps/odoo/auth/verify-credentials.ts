import { IGlobalVariable } from '@automatisch/types';
import { authenticate } from '../common/xmlrpc-client';

const verifyCredentials = async ($: IGlobalVariable) => {
  try {
    await authenticate($);

    await $.auth.set({
      screenName: `${$.auth.data.email} @ ${$.auth.data.databaseName} - ${$.auth.data.host}`,
    });
  } catch (error) {
    throw new Error('Failed while authorizing!');
  }
}

export default verifyCredentials;
