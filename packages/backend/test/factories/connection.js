import appConfig from '../../src/config/app';
import { AES } from 'crypto-js';
import Connection from '../../src/models/connection';

export const createConnection = async (params = {}) => {
  params.key = params?.key || 'deepl';

  const formattedData = params.formattedData || {
    screenName: 'Test - DeepL Connection',
    authenticationKey: 'test key',
  };

  delete params.formattedData;

  params.data = AES.encrypt(
    JSON.stringify(formattedData),
    appConfig.encryptionKey
  ).toString();

  const connection = await Connection.query().insertAndFetch(params);

  return connection;
};
