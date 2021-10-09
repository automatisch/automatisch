import fs from 'fs';

class App {
  static folderPath = __dirname + '/../apps'
  static list = fs.readdirSync(this.folderPath);

  static findAll(name?: string): string[] {
    if(!name) return this.list;
    return this.list.filter((app) => app.includes(name.toLowerCase()));
  }

  static findOneByName(name: string): object {
    const rawAppData = fs.readFileSync(this.folderPath + `/${name}/info.json`, 'utf-8');
    return JSON.parse(rawAppData);
  }
}

export default App;
