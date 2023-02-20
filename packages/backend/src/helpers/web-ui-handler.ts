import express, { Application } from 'express';
import { dirname, join } from 'path';
import appConfig from '../config/app';

const webUIHandler = async (app: Application) => {
  const webAppPath = require.resolve('@automatisch/web');
  const webBuildPath = join(dirname(webAppPath), 'build');
  const indexHtml = join(dirname(webAppPath), 'build', 'index.html');

  app.use(express.static(webBuildPath));
  app.get('*', (_req, res) => res.sendFile(indexHtml));
};

export default webUIHandler;
