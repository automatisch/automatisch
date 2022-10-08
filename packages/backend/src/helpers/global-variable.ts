import createHttpClient from './http-client';
import Connection from '../models/connection';
import Flow from '../models/flow';
import Step from '../models/step';
import { IJSONObject, IApp, IGlobalVariable } from '@automatisch/types';

const globalVariable = async (
  connection: Connection,
  appData: IApp,
  flow?: Flow,
  currentStep?: Step
): Promise<IGlobalVariable> => {
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
    app: appData,
    http: createHttpClient({ baseURL: appData.baseUrl }),
    db: {
      flow: {
        lastInternalId,
      },
      step: {
        parameters: currentStep?.parameters || {},
      },
    },
  };
};

export default globalVariable;
