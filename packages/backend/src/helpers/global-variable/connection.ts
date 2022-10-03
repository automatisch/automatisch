import HttpClient from '../http-client';
import Connection from '../../models/connection';
import { IJSONObject, IApp } from '@automatisch/types';

const prepareGlobalVariableForConnection = (
  connection: Connection,
  appData: IApp
) => {
  return {
    auth: {
      set: async (args: IJSONObject) => {
        await connection.$query().patchAndFetch({
          formattedData: {
            ...connection.formattedData,
            ...args,
          },
        });
      },
      ...connection.formattedData,
    },
    app: appData,
    http: new HttpClient({ baseURL: appData.baseUrl }),
  };
};

export default prepareGlobalVariableForConnection;
