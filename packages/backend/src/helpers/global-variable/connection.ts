import createHttpClient from '../http-client';
import Connection from '../../models/connection';
import Flow from '../../models/flow';
import {
  IJSONObject,
  IApp,
  IGlobalVariableForConnection,
} from '@automatisch/types';

const prepareGlobalVariableForConnection = (
  connection: Connection,
  appData: IApp,
  flow?: Flow
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
    db: {
      flow: flow,
    },
  };
};

export default prepareGlobalVariableForConnection;
