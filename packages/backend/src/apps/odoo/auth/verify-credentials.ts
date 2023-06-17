import xmlrpc from 'xmlrpc';
import {IGlobalVariable} from '@automatisch/types';
import asyncMethodCall from '../async-XMLRPC-client';

const verifyCredentials = async ($: IGlobalVariable) => {
  const port = $.auth.data.port ? parseInt($.auth.data.port.toString()) : 443;
  const client = await xmlrpc.createClient(
    {
      host: $.auth.data.hostName.toString(),
      port: port,
      path: '/xmlrpc/2/common',
    }
  );

  const uid = await asyncMethodCall(
    client,
    'authenticate',
    [
      $.auth.data.databaseName,
      $.auth.data.email,
      $.auth.data.apiKey,
      []
    ]
  );

  if (!Number.isInteger(uid)) {
    // failed to authenticate
    throw new Error(
      'Failed to connect to the Odoo server, check Odoo credentials'
    );
  }

  await $.auth.set({
    screenName: `${$.auth.data.hostName} - ${$.auth.data.databaseName} - ${$.auth.data.email}`,
  });
}

export default verifyCredentials;
