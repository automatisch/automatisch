import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';
import appConfig from '../config/app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function renderOpenApiJson(req, res) {
  const definition = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Automatisch',
        version: appConfig.version,
      },
    },
    host: `${appConfig.baseUrl}/api`,
  };

  const options = {
    definition,
    apis: [`${__dirname}/../controllers/api/**/*.js`],
  };

  const openapiSpec = await swaggerJsdoc(options);

  res.setHeader('Content-Type', 'application/json').send(openapiSpec);
}
