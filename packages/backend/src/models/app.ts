import fs from 'fs';
import { join } from 'path';
import { IApp } from '@automatisch/types';
import appInfoConverter from '../helpers/app-info-converter';
import getApp from '../helpers/get-app';

class App {
  static folderPath = join(__dirname, '../apps');
  static list = fs.readdirSync(this.folderPath);

  // Temporaryly restrict the apps we expose until
  // their actions/triggers are implemented!
  static temporaryList = [
    'flickr',
    'github',
    'scheduler',
    'slack',
    'twitter',
    'smtp',
  ];

  static async findAll(name?: string, stripFuncs = true): Promise<IApp[]> {
    if (!name)
      return Promise.all(
        this.temporaryList.map(
          async (name) => await this.findOneByName(name, stripFuncs)
        )
      );

    return Promise.all(
      this.temporaryList
        .filter((app) => app.includes(name.toLowerCase()))
        .map((name) => this.findOneByName(name, stripFuncs))
    );
  }

  static async findOneByName(name: string, stripFuncs = false): Promise<IApp> {
    const rawAppData = await getApp(name.toLocaleLowerCase(), stripFuncs);

    return appInfoConverter(rawAppData);
  }

  static async findOneByKey(key: string, stripFuncs = false): Promise<IApp> {
    const rawAppData = await getApp(key, stripFuncs);

    return appInfoConverter(rawAppData);
  }
}

export default App;
