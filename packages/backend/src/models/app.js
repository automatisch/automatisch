import fs from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';
import appInfoConverter from '@/helpers/app-info-converter.js';
import getApp from '@/helpers/get-app.js';
import { hasValidLicense } from '@/helpers/license.ee.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class App {
  static folderPath = join(__dirname, '../apps');
  static privatePath = join(__dirname, '../private-apps');

  static async list() {
    // Scan main apps directory - only include dirs with index.js
    const directories = fs.readdirSync(this.folderPath).filter((file) => {
      const fullPath = join(this.folderPath, file);
      if (!fs.statSync(fullPath).isDirectory()) return false;

      // Check if directory has index.js or index.ee.js
      const indexPath = join(fullPath, 'index.js');
      const indexEePath = join(fullPath, 'index.ee.js');
      return fs.existsSync(indexPath) || fs.existsSync(indexEePath);
    });

    // Add private apps if directory exists
    if (fs.existsSync(this.privatePath)) {
      const privateDirectories = fs
        .readdirSync(this.privatePath)
        .filter((file) => {
          const fullPath = join(this.privatePath, file);
          if (!fs.statSync(fullPath).isDirectory()) return false;

          // Check if directory has index.js or index.ee.js
          const indexPath = join(fullPath, 'index.js');
          const indexEePath = join(fullPath, 'index.ee.js');
          return fs.existsSync(indexPath) || fs.existsSync(indexEePath);
        });

      // Combine directories, avoiding duplicates, and sort alphabetically
      const allDirectories = [
        ...new Set([...directories, ...privateDirectories]),
      ].sort();

      if (!(await hasValidLicense())) {
        // Filter out enterprise apps if no valid license
        const nonEnterpriseApps = [];

        for (const dir of allDirectories) {
          const appData = await getApp(dir, true);

          if (!appData.enterprise) {
            nonEnterpriseApps.push(dir);
          }
        }

        return nonEnterpriseApps;
      }

      return allDirectories;
    }

    if (!(await hasValidLicense())) {
      // Filter out enterprise apps if no valid license
      const nonEnterpriseApps = [];

      for (const dir of directories) {
        const appData = await getApp(dir, true);

        if (!appData.enterprise) {
          nonEnterpriseApps.push(dir);
        }
      }

      return nonEnterpriseApps.sort();
    }

    return directories.sort();
  }

  static async findAll(name, stripFuncs = true) {
    const appList = await this.list();

    if (!name)
      return Promise.all(
        appList.map(async (name) => await this.findOneByName(name, stripFuncs))
      );

    return Promise.all(
      appList
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
