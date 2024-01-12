import { join } from 'node:path';
import xmlrpc from 'xmlrpc';

export const asyncMethodCall = async ($, { method, params, path }) => {
  return new Promise((resolve, reject) => {
    const client = getClient($, { path });

    client.methodCall(method, params, (error, response) => {
      if (error != null) {
        // something went wrong on the server side, display the error returned by Odoo
        reject(error);
      }

      resolve(response);
    });
  });
};

export const getClient = ($, { path = 'common' }) => {
  const host = $.auth.data.host;
  const port = Number($.auth.data.port);
  const secure = $.auth.data.secure === 'true';
  const createClientFunction = secure
    ? xmlrpc.createSecureClient
    : xmlrpc.createClient;

  return createClientFunction({
    host,
    port,
    path: join('/xmlrpc/2', path),
  });
};

export const authenticate = async ($) => {
  const uid = await asyncMethodCall($, {
    method: 'authenticate',
    params: [
      $.auth.data.databaseName,
      $.auth.data.email,
      $.auth.data.apiKey,
      [],
    ],
  });

  if (!Number.isInteger(uid)) {
    // failed to authenticate
    throw new Error(
      'Failed to connect to the Odoo server. Please, check the credentials!'
    );
  }

  return uid;
};
