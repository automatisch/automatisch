import appConfig from './config/app'
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import corsOptions from './config/cors-options';
import graphQLInstance from './helpers/graphql-instance';
import logger from './helpers/logger';
import morgan from './helpers/morgan';
import appAssetsHandler from './helpers/app-assets-handler';
import errorHandler from './helpers/error-handler';
import './config/database';
import authentication from './helpers/authentication';

const app = express();
const port = appConfig.port;

appAssetsHandler(app)

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
