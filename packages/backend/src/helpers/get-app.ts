import fs from 'fs';
import { join } from 'path';
import { IApp, IAuth, IAction, ITrigger } from '@automatisch/types';

const appsPath = join(__dirname, '../apps');

async function getDefaultExport(path: string) {
  return (await import(path)).default;
}

function stripFunctions<C>(data: C): C {
  return JSON.parse(
    JSON.stringify(data)
  );
}

async function getStrippedFileContent<C>(path: string): Promise<C> {
  try {
    const rawTriggerData = await getDefaultExport(path);

    return stripFunctions(rawTriggerData);
  } catch (err) {
    return null;
  }
}

async function getChildrenContentInDirectory<C>(path: string): Promise<C[]> {
  const appSubdirectory = join(appsPath, path);
  const childrenContent = [];

  if (fs.existsSync(appSubdirectory)) {
    const filesInSubdirectory = fs.readdirSync(appSubdirectory);

    for (const filename of filesInSubdirectory) {
      const filePath = join(appSubdirectory, filename, 'index.ts');
      const fileContent = await getStrippedFileContent<C>(filePath);

      childrenContent.push(fileContent);
    }

    return childrenContent;
  }

  return [];
}

const getApp = async (appKey: string) => {
  const appData: IApp = await getDefaultExport(`../apps/${appKey}`);

  appData.auth = await getStrippedFileContent<IAuth>(`../apps/${appKey}/auth/index.ts`);
  appData.triggers = await getChildrenContentInDirectory<ITrigger>(`${appKey}/triggers`);
  appData.actions = await getChildrenContentInDirectory<IAction>(`${appKey}/actions`);

  return appData;
};

export default getApp;
