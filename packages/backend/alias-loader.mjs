import generateAliasesResolver from 'esm-module-alias';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const aliases = {
  '@/models': join(__dirname, 'src/models'),
  '@/controllers': join(__dirname, 'src/controllers'),
  '@/helpers': join(__dirname, 'src/helpers'),
  '@/middlewares': join(__dirname, 'src/middlewares'),
  '@/config': join(__dirname, 'src/config'),
  '@/errors': join(__dirname, 'src/errors'),
  '@/queues': join(__dirname, 'src/queues'),
  '@/workers': join(__dirname, 'src/workers'),
  '@/jobs': join(__dirname, 'src/jobs'),
  '@/engine': join(__dirname, 'src/engine'),
  '@/routes': join(__dirname, 'src/routes'),
  '@/serializers': join(__dirname, 'src/serializers'),
  '@/factories': join(__dirname, 'test/factories'),
  '@/mocks': join(__dirname, 'test/mocks'),
  '@/test/workers': join(__dirname, 'test/workers'),
};

export const resolve = generateAliasesResolver(aliases);
