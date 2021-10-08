import fs from 'fs';

class App {
  static folderPath = __dirname + '/../apps'
  static list = fs.readdirSync(this.folderPath);

  static findAll(): string[] {
    return this.list;
  }

  static findAllByName(name: string): string[] {
    return this.list.filter((app) => app.includes(name.toLowerCase()));
  }
}

export default App;
