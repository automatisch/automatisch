import fs from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import appInfoConverter from '../helpers/app-info-converter.js';
import getApp from '../helpers/get-app.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class App {
  static folderPath = join(__dirname, '../apps');
  static list = fs
    .readdirSync(this.folderPath)
    .filter((file) => fs.statSync(join(this.folderPath, file)).isDirectory());

  static async findAll(name, stripFuncs = true) {
    if (!name)
      return Promise.all(
        this.list.map(
          async (name) => await this.findOneByName(name, stripFuncs)
        )
      );

    return Promise.all(
      this.list
        .filter((app) => app.includes(name.toLowerCase()))
        .map((name) => this.findOneByName(name, stripFuncs))
    );
  }

  static async findOneByName(name, stripFuncs = false) {
    const rawAppData = await getApp(name.toLocaleLowerCase(), stripFuncs);

    return appInfoConverter(rawAppData);
  }

  static async findOneByKey(key, stripFuncs = false) {
    const rawAppData = await getApp(key, stripFuncs);

    return appInfoConverter(rawAppData);
  }

  static async findAuthByKey(key, stripFuncs = false) {
    const rawAppData = await getApp(key, stripFuncs);
    const appData = appInfoConverter(rawAppData);

    return appData?.auth || {};
  }

  static async findTriggersByKey(key, stripFuncs = false) {
    const rawAppData = await getApp(key, stripFuncs);
    const appData = appInfoConverter(rawAppData);

    return appData?.triggers || [];
  }

  static async findTriggerSubsteps(appKey, triggerKey, stripFuncs = false) {
    const rawAppData = await getApp(appKey, stripFuncs);
    const appData = appInfoConverter(rawAppData);

    const trigger = appData?.triggers?.find(
      (trigger) => trigger.key === triggerKey
    );

    return trigger?.substeps || [];
  }

  static async findActionsByKey(key, stripFuncs = false) {
    const rawAppData = await getApp(key, stripFuncs);
    const appData = appInfoConverter(rawAppData);

    return appData?.actions || [];
  }

  static async findActionSubsteps(appKey, actionKey, stripFuncs = false) {
    const rawAppData = await getApp(appKey, stripFuncs);
    const appData = appInfoConverter(rawAppData);

    const action = appData?.actions?.find((action) => action.key === actionKey);

    return action?.substeps || [];
  }

  static async checkAppAndAction(appKey, actionKey) {
    const app = await this.findOneByKey(appKey);

    if (!actionKey) return;

    const hasAction = app.actions?.find((action) => action.key === actionKey);

    if (!hasAction) {
      throw new Error(
        `${app.name} does not have an action with the "${actionKey}" key!`
      );
    }
  }

  static async checkAppAndTrigger(appKey, triggerKey) {
    const app = await this.findOneByKey(appKey);

    if (!triggerKey) return;

    const hasTrigger = app.triggers?.find(
      (trigger) => trigger.key === triggerKey
    );

    if (!hasTrigger) {
      throw new Error(
        `${app.name} does not have a trigger with the "${triggerKey}" key!`
      );
    }
  }
}

export default App;
