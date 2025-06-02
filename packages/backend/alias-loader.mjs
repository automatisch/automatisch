import generateAliasesResolver from 'esm-module-alias';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const aliases = {
  '@': join(__dirname, 'src'),
};

export const resolve = generateAliasesResolver(aliases);
