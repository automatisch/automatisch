import express, { Application } from 'express';

const appAssetsHandler = async (app: Application) => {
  app.use('/apps/:appKey/assets/favicon.svg', (req, res, next) => {
    const { appKey } = req.params;
    const svgPath = `${__dirname}/../apps/${appKey}/assets/favicon.svg`;
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
