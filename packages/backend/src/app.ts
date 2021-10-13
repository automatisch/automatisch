import './config/database';

import cors from 'cors';
import express, { NextFunction,Request, Response } from 'express';
import createError from 'http-errors';

import appConfig from './config/app'
import corsOptions from './config/cors-options';
import authentication from './helpers/authentication';
import errorHandler from './helpers/error-handler';
import graphQLInstance from './helpers/graphql-instance';
import logger from './helpers/logger';
import morgan from './helpers/morgan';

const app = express();
const port = appConfig.port;

app.use(morgan);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(authentication);
app.use('/graphql', graphQLInstance);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

app.use(errorHandler);

app.listen(port, () => {
  logger.info(`Server is listening on ${port}`)
})
