import { authenticate } from '../common/xmlrpc-client.js';

const verifyCredentials = async ($) => {
  try {
    await authenticate($);

    await $.auth.set({
      screenName: `${$.auth.data.email} @ ${$.auth.data.databaseName} - ${$.auth.data.host}`,
    });
  } catch (error) {
    throw new Error('Failed while authorizing!');
  }
};

export default verifyCredentials;
