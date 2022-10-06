import express, { Application } from 'express';
import App from '../models/app';

const appAssetsHandler = async (app: Application) => {
  const appList = await App.findAll();

  appList.forEach((appItem) => {
    const svgPath = `${__dirname}/../apps/${appItem.name}/assets/favicon.svg`;
    const staticFileHandlerOptions = {
      /**
       * Disabling fallthrough is important to respond with HTTP 404.
       * Otherwise, web app might be served.
       */
      fallthrough: false,
    };
    const staticFileHandler = express.static(svgPath, staticFileHandlerOptions);

    app.use(`/apps/${appItem.name}/assets/favicon.svg`, staticFileHandler);
  });
};

export default appAssetsHandler;
