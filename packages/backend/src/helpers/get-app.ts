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

async function getFileContent<C>(path: string, stripFuncs: boolean): Promise<C> {
  try {
    const fileContent = await getDefaultExport(path);

    if (stripFuncs) {
      return stripFunctions(fileContent);
    }

    return fileContent;
  } catch (err) {
    return null;
  }
}

async function getChildrenContentInDirectory<C>(path: string, stripFuncs: boolean): Promise<C[]> {
  const appSubdirectory = join(appsPath, path);
  const childrenContent = [];

  if (fs.existsSync(appSubdirectory)) {
    const filesInSubdirectory = fs.readdirSync(appSubdirectory);

    for (const filename of filesInSubdirectory) {
      const filePath = join(appSubdirectory, filename, 'index.ts');
      const fileContent = await getFileContent<C>(filePath, stripFuncs);

      childrenContent.push(fileContent);
    }

    return childrenContent;
  }

  return [];
}

const getApp = async (appKey: string, stripFuncs = true) => {
  const appData: IApp = await getDefaultExport(`../apps/${appKey}`);

  appData.auth = await getFileContent<IAuth>(`../apps/${appKey}/auth/index.ts`, stripFuncs);
  appData.triggers = await getChildrenContentInDirectory<ITrigger>(`${appKey}/triggers`, stripFuncs);
  appData.actions = await getChildrenContentInDirectory<IAction>(`${appKey}/actions`, stripFuncs);

  return appData;
};

export default getApp;
