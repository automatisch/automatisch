import appConfig from './config/app';
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import corsOptions from './config/cors-options';
import graphQLInstance from './helpers/graphql-instance';
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

if (appConfig.enableBullMQDashboard) {
  createBullBoardHandler(serverAdapter);
}

const app = express();

if (appConfig.enableBullMQDashboard) {
  injectBullBoardHandler(app, serverAdapter);
}

appAssetsHandler(app);

app.use(morgan);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use('/graphql', graphQLInstance);

webUIHandler(app);

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

app.use(errorHandler);

export default app;
