import appEnv from './config/app-env'
import createError from 'http-errors';
import express, { Request, Response, NextFunction } from 'express';
import logger from 'morgan';

import indexRouter from './routes/index';

const app = express();
const port = appEnv.port;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, _next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})
