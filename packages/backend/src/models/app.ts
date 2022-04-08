import fs from 'fs';
import { dirname, join } from 'path';
import { IApp } from '@automatisch/types';
import appInfoConverter from '../helpers/app-info-converter';

class App {
  static backendPath = require.resolve('@automatisch/backend');
  static folderPath = join(dirname(this.backendPath), 'apps');
  static list = fs.readdirSync(this.folderPath);

  static findAll(name?: string): IApp[] {
    if (!name) return this.list.map((name) => this.findOneByName(name));

    return this.list
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
