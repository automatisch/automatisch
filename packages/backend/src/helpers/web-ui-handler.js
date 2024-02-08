import express from 'express';
import path, { join } from 'path';
import appConfig from '../config/app.js';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const webUIHandler = async (app) => {
  if (appConfig.serveWebAppSeparately) return;

  const webAppPath = join(__dirname, '../../../web/');
  const webBuildPath = join(webAppPath, 'build');
  const indexHtml = join(webAppPath, 'build', 'index.html');

  app.use(express.static(webBuildPath));

  app.get('*', (_req, res) => {
    res.set('Content-Security-Policy', 'frame-ancestors \'none\';');
    res.set('X-Frame-Options', 'DENY');

    res.sendFile(indexHtml);
  });
};

export default webUIHandler;
