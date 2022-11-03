import {
  IAction,
  IApp,
  IRawAction,
  IRawTrigger,
  ITrigger,
} from '@automatisch/types';
import { omit, cloneDeep } from 'lodash';
import addReconnectionSteps from './add-reconnection-steps';

async function getDefaultExport(path: string) {
  return (await import(path)).default;
}

function stripFunctions<C>(data: C): C {
  return JSON.parse(JSON.stringify(data));
}

const getApp = async (appKey: string, stripFuncs = true) => {
  let appData: IApp = cloneDeep(await getDefaultExport(`../apps/${appKey}`));

  if (appData.auth) {
    appData = addReconnectionSteps(appData);
  }

  appData.triggers = appData?.triggers?.map((trigger: IRawTrigger) => {
    return addStaticSubsteps('trigger', appData, trigger);
  });

  appData.actions = appData?.actions?.map((action: IRawAction) => {
    return addStaticSubsteps('action', appData, action);
  });

  if (stripFuncs) {
    return stripFunctions(appData);
  }

  return appData;
};

const chooseConnectionStep = {
  key: 'chooseConnection',
  name: 'Choose connection',
};

const testStep = (stepType: 'trigger' | 'action') => {
  return {
    key: 'testStep',
    name: stepType === 'trigger' ? 'Test trigger' : 'Test action',
  };
};

const addStaticSubsteps = (
  stepType: 'trigger' | 'action',
  appData: IApp,
  step: IRawTrigger | IRawAction
) => {
  const computedStep: ITrigger | IAction = omit(step, ['arguments']);

  computedStep.substeps = [];

  if (appData.supportsConnections) {
    computedStep.substeps.push(chooseConnectionStep);
  }

  if (step.arguments) {
    computedStep.substeps.push({
      key: 'chooseTrigger',
      name: stepType === 'trigger' ? 'Set up a trigger' : 'Set up action',
      arguments: step.arguments,
    });
  }

  computedStep.substeps.push(testStep(stepType));

  return computedStep;
};

export default getApp;
