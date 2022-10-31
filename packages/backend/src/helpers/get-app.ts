import {
  IAction,
  IApp,
  IRawAction,
  IRawTrigger,
  ITrigger,
} from '@automatisch/types';
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
    return addStaticSubsteps(appData, trigger);
  });

  appData.actions = appData?.actions?.map((action: IRawAction) => {
    return addStaticSubsteps(appData, action);
  });

  if (stripFuncs) {
    return stripFunctions(appData);
  }

  return appData;
};

const addStaticSubsteps = (appData: IApp, step: IRawTrigger | IRawAction) => {
  const computedStep: ITrigger | IAction = omit(step, ['arguments']);

  computedStep.substeps = [];

  if (appData.supportsConnections) {
    computedStep.substeps.push(chooseConnectionStep);
  }

  if (step.arguments) {
    computedStep.substeps.push({
      key: 'chooseTrigger',
      name: 'Set up a trigger',
      arguments: step.arguments,
    });
  }

  computedStep.substeps.push(testStep);

  return computedStep;
};

export default getApp;
