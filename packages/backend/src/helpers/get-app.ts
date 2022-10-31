import { IApp, IRawTrigger, ITrigger } from '@automatisch/types';
import { omit, cloneDeep } from 'lodash';

async function getDefaultExport(path: string) {
  return (await import(path)).default;
}

function stripFunctions<C>(data: C): C {
  return JSON.parse(JSON.stringify(data));
}

const chooseConnectionStep = {
  key: 'chooseConnection',
  name: 'Choose connection',
};

const testStep = {
  key: 'testStep',
  name: 'Test trigger',
};

const getApp = async (appKey: string, stripFuncs = true) => {
  const appData: IApp = cloneDeep(await getDefaultExport(`../apps/${appKey}`));

  appData.triggers = appData?.triggers?.map((trigger: IRawTrigger) => {
    const computedTrigger: ITrigger = omit(trigger, ['arguments']);

    computedTrigger.substeps = [];

    if (appData.supportsConnections) {
      computedTrigger.substeps.push(chooseConnectionStep);
    }

    if (trigger.arguments) {
      computedTrigger.substeps.push({
        key: 'chooseTrigger',
        name: 'Set up a trigger',
        arguments: trigger.arguments,
      });
    }

    computedTrigger.substeps.push(testStep);

    return computedTrigger;
  });

  if (stripFuncs) {
    return stripFunctions(appData);
  }

  return appData;
};

export default getApp;
