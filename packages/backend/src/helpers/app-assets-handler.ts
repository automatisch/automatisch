import express, { Application } from 'express';
import App from '../models/app';

const appAssetsHandler = async (app: Application) => {
  const appNames = App.list;

  appNames.forEach(appName => {
    app.use(
      `/apps/${appName}/assets/favicon.svg`,
      express.static(`src/apps/${appName}/assets/favicon.svg`)
    )
  })
}

export default appAssetsHandler;
