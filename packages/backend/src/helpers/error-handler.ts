import { NextFunction,Request, Response } from 'express';

import logger from './logger';

const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  if(err.message === 'Not Found') {
    res.status(404).end()
  } else {
    logger.error(err.message)
    res.status(500).end()
  }
}

export default errorHandler;
