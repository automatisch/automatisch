import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const appAssetsHandler = async (app) => {
  app.use('/apps/:appKey/assets/favicon.svg', (req, res, next) => {
    const { appKey } = req.params;
    const svgPath = path.resolve(`${__dirname}/../apps/${appKey}/assets/favicon.svg`);
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
