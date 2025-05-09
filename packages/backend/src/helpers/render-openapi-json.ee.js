import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import swaggerJsdoc from 'swagger-jsdoc';
import appConfig from '../config/app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async function renderOpenApiJson(req, res) {
  const definition = {
    openapi: '3.0.0',
    info: {
      title: appConfig.isMation ? 'Mation' : 'Automatisch',
      version: appConfig.version,
    },
    servers: [
      {
        url: `${appConfig.baseUrl}/api`,
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'x-api-token',
        },
      },
    },
  };

  const options = {
    definition,
    apis: [`${__dirname}/../controllers/api/**/*.js`],
  };

  const openapiSpec = await swaggerJsdoc(options);

  res.setHeader('Content-Type', 'application/json').send(openapiSpec);
}
