import express, { Application } from 'express';
import { dirname, join } from 'path';
import appConfig from '../config/app';

const webUIHandler = async (app: Application) => {
  if (appConfig.serveWebAppSeparately) return;

  const webAppPath = require.resolve('@automatisch/web');
  const webBuildPath = join(dirname(webAppPath), 'build');
  const indexHtml = join(dirname(webAppPath), 'build', 'index.html');

  app.use(express.static(webBuildPath));
  app.get('*', (_req, res) => {
    res.set('Content-Security-Policy', 'frame-ancestors: none;');
    res.set('X-Frame-Options', 'DENY');

    res.sendFile(indexHtml);
  });
};

export default webUIHandler;
