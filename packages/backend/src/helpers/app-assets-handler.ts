import express, { Application } from 'express';
import App from '../models/app';

const appAssetsHandler = async (app: Application) => {
  const appNames = App.list;

  appNames.forEach(appName => {
    const svgPath = `${__dirname}/../apps/${appName}/assets/favicon.svg`;
    const staticFileHandlerOptions = {
      /**
       * Disabling fallthrough is important to respond with HTTP 404.
       * Otherwise, web app might be served.
       */
      fallthrough: false,
    };
    const staticFileHandler = express.static(svgPath, staticFileHandlerOptions);

    app.use(
      `/apps/${appName}/assets/favicon.svg`,
      staticFileHandler
    )
  })
}

export default appAssetsHandler;
