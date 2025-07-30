import cors from 'cors';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yamljs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const assetsHandler = async (app) => {
  app.use('/apps/:appKey/assets/favicon.svg', (req, res, next) => {
    const { appKey } = req.params;

    const appSvgPath = path.resolve(
      `${__dirname}/../apps/${appKey}/assets/favicon.svg`
    );

    const privateAppSvgPath = path.resolve(
      `${__dirname}/../private-apps/${appKey}/assets/favicon.svg`
    );

    const svgPath = fs.existsSync(privateAppSvgPath)
      ? privateAppSvgPath
      : appSvgPath;

    const staticFileHandlerOptions = {
      /**
       * Disabling fallthrough is important to respond with HTTP 404.
       * Otherwise, web app might be served.
       */
      fallthrough: false,
    };

    const staticFileHandler = express.static(svgPath, staticFileHandlerOptions);

    return staticFileHandler(req, res, next);
  });

  app.use('/api/openapi.json', cors({ origin: '*' }), (req, res) => {
    const swaggerPath = path.resolve(
      `${__dirname}/../controllers/api/openapi.yaml`
    );

    const swaggerDocument = YAML.load(swaggerPath);

    res.json(swaggerDocument);
  });
};

export default assetsHandler;
