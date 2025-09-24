import appConfig from '@/config/app.js';
import CryptoJS from 'crypto-js';
import Connection from '@/models/connection.js';

export const createConnection = async (params = {}) => {
  params.key = params?.key || 'deepl';

  const formattedData = params.formattedData || {
    screenName: 'Test - DeepL Connection',
    authenticationKey: 'test key',
  };

  delete params.formattedData;

  params.data = CryptoJS.AES.encrypt(
    JSON.stringify(formattedData),
    appConfig.encryptionKey
  ).toString();

  const connection = await Connection.query().insertAndFetch(params);

  return connection;
};
