import path, { join } from 'path';
import fs from 'node:fs';
import omit from 'lodash/omit.js';
import cloneDeep from 'lodash/cloneDeep.js';
import addAuthenticationSteps from '@/helpers/add-authentication-steps.js';
import addReconnectionSteps from '@/helpers/add-reconnection-steps.js';
import commonApiRequestAction from '@/helpers/common-api-request-action.js';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function scanAppsInDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return {};

  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .reduce((apps, dirent) => {
      if (!dirent.isDirectory()) return apps;

      const indexPath = join(dirPath, dirent.name, 'index.js');
      const indexEePath = join(dirPath, dirent.name, 'index.ee.js');

      // Only include directories that have index.js or index.ee.js
      if (fs.existsSync(indexEePath)) {
        apps[dirent.name] = import(pathToFileURL(indexEePath));
      } else if (fs.existsSync(indexPath)) {
        apps[dirent.name] = import(pathToFileURL(indexPath));
      }
      // Skip directories without index files (like .git, incomplete apps, etc.)

      return apps;
    }, {});
}

const appsDir = path.resolve(__dirname, '../apps');
const privateAppsDir = path.resolve(__dirname, '../private-apps');

const apps = {
  ...scanAppsInDirectory(appsDir),
  ...scanAppsInDirectory(privateAppsDir),
};

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

  // Inject API request action for apps that support connections and use HTTP APIs
  // Exclude apps that don't consume HTTP APIs even though they have connections
  const nonHttpApps = ['postgresql', 'smtp'];
  if (appData.supportsConnections && !nonHttpApps.includes(appData.key)) {
    const processedApiRequestAction = addStaticSubsteps(
      'action',
      appData,
      commonApiRequestAction
    );

    appData.actions = [...(appData.actions || []), processedApiRequestAction];
  }

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

  if (appData.supportsConnections && step.supportsConnections !== false) {
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
