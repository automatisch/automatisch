import appConfig from './config/app'
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import corsOptions from './config/cors-options';
import { graphqlHTTP } from 'express-graphql';
import logger from './helpers/logger';
import morgan from './helpers/morgan';

import rootResolver from './graphql/root-resolver'
import graphQLSchema from './graphql/graphql-schema'

const app = express();
const port = appConfig.port;

app.use(morgan);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors(corsOptions))

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQLSchema,
    rootValue: rootResolver,
    graphiql: true,
  }),
);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, _next: NextFunction) {
  if(err.message === 'Not Found') {
    res.status(404).end()
  } else {
    logger.error(err.message)
    res.status(500).end()
  }
});

app.listen(port, () => {
  logger.info(`Server is listening on ${port}`)
})
