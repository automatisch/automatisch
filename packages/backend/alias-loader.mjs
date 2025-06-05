import generateAliasesResolver from 'esm-module-alias';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const aliases = {
  '@/models': join(__dirname, 'src/models'),
  '@/helpers': join(__dirname, 'src/helpers'),
  '@/config': join(__dirname, 'src/config'),
  '@/errors': join(__dirname, 'src/errors'),
  '@/queues': join(__dirname, 'src/queues'),
  '@/services': join(__dirname, 'src/services'),
  '@/factories': join(__dirname, 'test/factories'),
  '@/mocks': join(__dirname, 'test/mocks'),
};

export const resolve = generateAliasesResolver(aliases);
