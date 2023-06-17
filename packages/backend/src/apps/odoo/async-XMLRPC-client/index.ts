import xmlrpc from 'xmlrpc';
import {IGlobalVariable} from "@automatisch/types";

export const asyncMethodCall = async (client: xmlrpc.Client, method: string, params: any[]): Promise<number> => {
  return new Promise(
    (resolve, reject) => {
      client.methodCall(
        method,
        params,
        (error, response) => {
          if (error != null) {
            // something went wrong on the server side, display the error returned by Odoo
            reject(error);
          }

          resolve(response);
        }
      )
    }
  );
}

export const authenticate  = async ($: IGlobalVariable) => {
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

  return uid;
}
