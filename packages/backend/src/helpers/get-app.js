import path from 'node:path';
import fs from 'node:fs';
import omit from 'lodash/omit.js';
import cloneDeep from 'lodash/cloneDeep.js';
import addAuthenticationSteps from './add-authentication-steps.js';
import addReconnectionSteps from './add-reconnection-steps.js';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apps = fs
  .readdirSync(path.resolve(__dirname, `../apps/`), { withFileTypes: true })
  .reduce((apps, dirent) => {
    if (!dirent.isDirectory()) return apps;

    apps[dirent.name] = import(
      pathToFileURL(path.resolve(__dirname, '../apps', dirent.name, 'index.js'))
        .href
    );

    return apps;
  }, {});

async function getAppDefaultExport(appKey) {
  if (!Object.prototype.hasOwnProperty.call(apps, appKey)) {
    throw new Error(
      `An application with the "${appKey}" key couldn't be found.`
    );
  }

  return (await apps[appKey]).default;
}

function stripFunctions(data) {
  return JSON.parse(JSON.stringify(data));
}

const getApp = async (appKey, stripFuncs = true) => {
  let appData = cloneDeep(await getAppDefaultExport(appKey));

  if (appData.auth) {
    appData = addAuthenticationSteps(appData);
    appData = addReconnectionSteps(appData);
  }

  appData.triggers = appData?.triggers?.map((trigger) => {
    return addStaticSubsteps('trigger', appData, trigger);
  });

  appData.actions = appData?.actions?.map((action) => {
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

const testStep = (stepType) => {
  return {
    key: 'testStep',
    name: stepType === 'trigger' ? 'Test trigger' : 'Test action',
  };
};

const addStaticSubsteps = (stepType, appData, step) => {
  const computedStep = omit(step, ['arguments']);

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
