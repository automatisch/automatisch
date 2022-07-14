import fs from 'fs';
import { join } from 'path';
import { IApp } from '@automatisch/types';
import appInfoConverter from '../helpers/app-info-converter';

class App {
  static folderPath = join(__dirname, '../apps');
  static list = fs.readdirSync(this.folderPath);

  // Temporaryly restrict the apps we expose until
  // their actions/triggers are implemented!
  static temporaryList = [
    'slack',
    'twitter',
    'github',
    'scheduler',
    'typeform',
  ];

  static findAll(name?: string): IApp[] {
    if (!name)
      return this.temporaryList.map((name) => this.findOneByName(name));

    return this.temporaryList
      .filter((app) => app.includes(name.toLowerCase()))
      .map((name) => this.findOneByName(name));
  }

  static findOneByName(name: string): IApp {
    const rawAppData = fs.readFileSync(
      this.folderPath + `/${name}/info.json`,
      'utf-8'
    );
    return appInfoConverter(rawAppData);
  }

  static findOneByKey(key: string): IApp {
    const rawAppData = fs.readFileSync(
      this.folderPath + `/${key}/info.json`,
      'utf-8'
    );
    return appInfoConverter(rawAppData);
  }
}

export default App;
