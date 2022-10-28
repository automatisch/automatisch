import { IApp } from '@automatisch/types';

async function getDefaultExport(path: string) {
  return (await import(path)).default;
}

function stripFunctions<C>(data: C): C {
  return JSON.parse(JSON.stringify(data));
}

const getApp = async (appKey: string, stripFuncs = true) => {
  const appData: IApp = await getDefaultExport(`../apps/${appKey}`);

  if (stripFuncs) {
    return stripFunctions(appData);
  }

  return appData;
};

export default getApp;
