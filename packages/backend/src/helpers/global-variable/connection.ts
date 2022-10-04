import createHttpClient from '../http-client';
import Connection from '../../models/connection';
import {
  IJSONObject,
  IApp,
  IGlobalVariableForConnection,
} from '@automatisch/types';

const prepareGlobalVariableForConnection = (
  connection: Connection,
  appData: IApp
): IGlobalVariableForConnection => {
  return {
    auth: {
      set: async (args: IJSONObject) => {
        return await connection.$query().patchAndFetch({
          formattedData: {
            ...connection.formattedData,
            ...args,
          },
        });
      },
      data: connection.formattedData,
    },
    app: appData,
    http: createHttpClient({ baseURL: appData.baseUrl }),
  };
};

export default prepareGlobalVariableForConnection;
