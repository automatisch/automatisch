import fs from 'fs';
import { join } from 'path';
import { IApp } from '@automatisch/types';

const folderPath = join(__dirname, '../apps');

const getApp = async (appKey: string) => {
  const appData: IApp = (await import(`../apps/${appKey}`)).default;

  let rawAuthData = (await import(`../apps/${appKey}/auth/index.ts`)).default;

  rawAuthData = Object.fromEntries(
    Object.entries(rawAuthData).filter(
      ([key]) => typeof rawAuthData[key] !== 'function'
    )
  );

  appData.auth = rawAuthData;

  appData.triggers = [];

  const triggersPath = join(folderPath, appKey, 'triggers');

  if (fs.existsSync(triggersPath)) {
    const triggersFolder = fs.readdirSync(join(folderPath, appKey, 'triggers'));

    for (const triggerName of triggersFolder) {
      let rawTriggerData = (
        await import(`../apps/${appKey}/triggers/${triggerName}/index.ts`)
      ).default;

      rawTriggerData = Object.fromEntries(
        Object.entries(rawTriggerData).filter(
          ([key]) => typeof rawTriggerData[key] !== 'function'
        )
      );

      appData.triggers.push(rawTriggerData);
    }
  }

  appData.actions = [];

  const actionsPath = join(folderPath, appKey, 'actions');

  if (fs.existsSync(actionsPath)) {
    const actionsFolder = fs.readdirSync(join(folderPath, appKey, 'actions'));

    for await (const actionName of actionsFolder) {
      let rawActionData = (
        await import(`../apps/${appKey}/actions/${actionName}/index.ts`)
      ).default;

      rawActionData = Object.fromEntries(
        Object.entries(rawActionData).filter(
          ([key]) => typeof rawActionData[key] !== 'function'
        )
      );

      appData.actions.push(rawActionData);
    }
  }

  return appData;
};

export default getApp;
