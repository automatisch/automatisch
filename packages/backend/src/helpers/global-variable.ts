import createHttpClient from './http-client';
import Connection from '../models/connection';
import Flow from '../models/flow';
import Step from '../models/step';
import { IJSONObject, IApp, IGlobalVariable } from '@automatisch/types';

type GlobalVariableOptions = {
  connection?: Connection;
  app: IApp;
  flow?: Flow;
  step?: Step;
};

const globalVariable = async (
  options: GlobalVariableOptions
): Promise<IGlobalVariable> => {
  const { connection, app, flow, step } = options;

  const lastInternalId = await flow?.lastInternalId();

  return {
    auth: {
      set: async (args: IJSONObject) => {
        if (connection) {
          await connection.$query().patchAndFetch({
            formattedData: {
              ...connection.formattedData,
              ...args,
            },
          });
        }

        return null;
      },
      data: connection?.formattedData,
    },
    app: app,
    http: createHttpClient({ baseURL: app.baseUrl }),
    flow: {
      lastInternalId,
    },
    step: {
      parameters: step?.parameters || {},
    },
  };
};

export default globalVariable;
