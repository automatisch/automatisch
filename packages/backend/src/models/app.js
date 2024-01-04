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
    .filter((file) => fs.statSync(this.folderPath + '/' + file).isDirectory());

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
