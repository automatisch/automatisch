import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const compileEmail = (emailPath, replacements = {}) => {
  const filePath = path.join(__dirname, `../views/emails/${emailPath}.hbs`);
  const source = fs.readFileSync(filePath, 'utf-8').toString();
  const template = handlebars.compile(source);
  return template(replacements);
};

export default compileEmail;
