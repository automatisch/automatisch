import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testEnvFile = path.resolve(__dirname, '../../.env.test');

if (!fs.existsSync(testEnvFile)) {
  throw new Error(
    'Test environment file (.env.test) not found! You can copy .env-example.test to .env.test and fill it with your own values.'
  );
}
