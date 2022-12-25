import createError from 'http-errors';
import express from 'express';
import cors from 'cors';
import corsOptions from './config/cors-options';
import morgan from './helpers/morgan';
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
import { IRequest } from '@automatisch/types';

createBullBoardHandler(serverAdapter);

const app = express();

injectBullBoardHandler(app, serverAdapter);

appAssetsHandler(app);

app.use(morgan);
app.use(
  express.json({
    verify(req, res, buf) {
      (req as IRequest).rawBody = buf;
    },
  })
);
app.use(express.urlencoded({
  extended: false,
  verify(req, res, buf) {
    (req as IRequest).rawBody = buf;
  },
}));
app.use(cors(corsOptions));
app.use('/', router);

webUIHandler(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(errorHandler);

export default app;
