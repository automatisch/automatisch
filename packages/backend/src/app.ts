import createError from 'http-errors';
import express from 'express';
import cors from 'cors';

import { IRequest } from '@automatisch/types';
import appConfig from './config/app';
import corsOptions from './config/cors-options';
import morgan from './helpers/morgan';
import * as Sentry from './helpers/sentry.ee';
import appAssetsHandler from './helpers/app-assets-handler';
import webUIHandler from './helpers/web-ui-handler';
import errorHandler from './helpers/error-handler';
import './config/orm';
import {
  createBullBoardHandler,
  serverAdapter,
} from './helpers/create-bull-board-handler';
import injectBullBoardHandler from './helpers/inject-bull-board-handler';
import router from './routes';
import configurePassport from './helpers/passport';

createBullBoardHandler(serverAdapter);

const app = express();

Sentry.init(app);

Sentry.attachRequestHandler(app);
Sentry.attachTracingHandler(app);

injectBullBoardHandler(app, serverAdapter);

appAssetsHandler(app);

app.use(morgan);

app.use(
  express.json({
    limit: appConfig.requestBodySizeLimit,
    verify(req, res, buf) {
      (req as IRequest).rawBody = buf;
    },
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: appConfig.requestBodySizeLimit,
    verify(req, res, buf) {
      (req as IRequest).rawBody = buf;
    },
  })
);
app.use(cors(corsOptions));

configurePassport(app);

app.use('/', router);

webUIHandler(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

Sentry.attachErrorHandler(app);

app.use(errorHandler);

export default app;
