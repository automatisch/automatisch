import createError from 'http-errors';
import express from 'express';
import cors from 'cors';

import appConfig from './config/app.js';
import corsOptions from './config/cors-options.js';
import morgan from './helpers/morgan.js';
import * as Sentry from './helpers/sentry.ee.js';
import appAssetsHandler from './helpers/app-assets-handler.js';
import webUIHandler from './helpers/web-ui-handler.js';
import errorHandler from './helpers/error-handler.js';
import './config/orm.js';
import {
  createBullBoardHandler,
  serverAdapter,
} from './helpers/create-bull-board-handler.js';
import injectBullBoardHandler from './helpers/inject-bull-board-handler.js';
import router from './routes/index.js';
import configurePassport from './helpers/passport.js';

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
      req.rawBody = buf;
    },
  })
);
app.use(
  express.urlencoded({
    extended: true,
    limit: appConfig.requestBodySizeLimit,
    verify(req, res, buf) {
      req.rawBody = buf;
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
