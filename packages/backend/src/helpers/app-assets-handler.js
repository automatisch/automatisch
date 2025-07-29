import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const appAssetsHandler = async (app) => {
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
};

export default appAssetsHandler;
