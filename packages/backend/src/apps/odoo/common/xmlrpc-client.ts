import { join } from 'node:path';
import xmlrpc from 'xmlrpc';
import { IGlobalVariable } from "@automatisch/types";

type AsyncMethodCallPayload = {
  method: string;
  params: any[];
  path?: string;
}

export const asyncMethodCall = async <T = number>($: IGlobalVariable, { method, params, path }: AsyncMethodCallPayload): Promise<T> => {
  return new Promise(
    (resolve, reject) => {
      const client = getClient($, { path });

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

export const getClient = ($: IGlobalVariable, { path = 'common' }) => {
  const host = $.auth.data.host as string;
  const port = Number($.auth.data.port as string);
  const secure = $.auth.data.secure === 'true';
  const createClientFunction = secure ? xmlrpc.createSecureClient : xmlrpc.createClient;

  return createClientFunction(
    {
      host,
      port,
      path: join('/xmlrpc/2', path),
    }
  );
}

export const authenticate = async ($: IGlobalVariable) => {
  const uid = await asyncMethodCall(
    $,
    {
      method: 'authenticate',
      params: [
        $.auth.data.databaseName,
        $.auth.data.email,
        $.auth.data.apiKey,
        []
      ]
    }
  );

  if (!Number.isInteger(uid)) {
    // failed to authenticate
    throw new Error(
      'Failed to connect to the Odoo server. Please, check the credentials!'
    );
  }

  return uid;
}
