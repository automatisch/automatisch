import fs from 'fs';

class App {
  static folderPath = __dirname + '/../apps'
  static list = fs.readdirSync(this.folderPath);

  static findAll(name?: string): string[] {
    if(!name) return this.list;
    return this.list.filter((app) => app.includes(name.toLowerCase()));
  }
}

export default App;
