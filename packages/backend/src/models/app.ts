import fs from 'fs';

class App {
  static folderPath = __dirname + '/../apps';
  static list = fs.readdirSync(this.folderPath);

  static async findAll(name?: string): Promise<object[]> {
    let appList;

    if(!name) {
      appList = this.list.map(async (name) => await this.findOneByName(name));
    } else {
      appList = this.list
        .filter((app) => app.includes(name.toLowerCase()))
        .map(async (name) => await this.findOneByName(name));
    }

    return Promise.all(appList)
  }

  static async findOneByName(name: string): Promise<object> {
    const rawAppData = (await import(`../apps/${name}/info`)).default;
    return rawAppData;
  }

  static async findOneByKey(key: string): Promise<object> {
    const rawAppData = (await import(`../apps/${key}/info`)).default;
    return rawAppData;
  }
}

export default App;
