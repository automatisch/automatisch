import createHttpClient from '../http-client';
import Connection from '../../models/connection';
import { IJSONObject, IApp } from '@automatisch/types';
import { AxiosInstance as IHttpClient } from 'axios';

type IGlobalVariableForConnection = {
  auth: {
    set: (args: IJSONObject) => Promise<Connection>;
  };
  app: IApp;
  http: IHttpClient;
};

const prepareGlobalVariableForConnection = (
  connection: Connection,
  appData: IApp
): IGlobalVariableForConnection => {
  return {
    auth: {
      set: async (args: IJSONObject) => {
        const persistedConnection = await connection.$query().patchAndFetch({
          formattedData: {
            ...connection.formattedData,
            ...args,
          },
        });

        return persistedConnection;
      },
      ...connection.formattedData,
    },
    app: appData,
    http: createHttpClient({ baseURL: appData.baseUrl }),
  };
};

export default prepareGlobalVariableForConnection;
