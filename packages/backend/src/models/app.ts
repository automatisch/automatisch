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
  static temporaryList = ['slack', 'twitter'];

  static async findAll(name?: string): Promise<IApp[]> {
    if (!name)
      return Promise.all(
        this.temporaryList.map(async (name) => await this.findOneByName(name))
      );

    return Promise.all(
      this.temporaryList
        .filter((app) => app.includes(name.toLowerCase()))
        .map((name) => this.findOneByName(name))
    );
  }

  static async findOneByName(name: string): Promise<IApp> {
    const rawAppData = await getApp(name.toLocaleLowerCase());
    return appInfoConverter(rawAppData);
  }

  static async findOneByKey(key: string): Promise<IApp> {
    const rawAppData = await getApp(key);
    return appInfoConverter(rawAppData);
  }
}

export default App;
