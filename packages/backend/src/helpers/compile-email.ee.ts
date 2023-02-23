import * as path from 'path';
import * as fs from 'fs';
import * as handlebars from 'handlebars';

const compileEmail = (emailPath: string, replacements: object = {}): string => {
  const filePath = path.join(__dirname, `../views/emails/${emailPath}.ee.hbs`);
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  return template(replacements);
};

export default compileEmail;
