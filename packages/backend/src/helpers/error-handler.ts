import { Request, Response } from 'express';
import logger from './logger';

type Error = {
  message: string;
}

const errorHandler = (err: Error, req: Request, res: Response): void => {
  if(err.message === 'Not Found') {
    res.status(404).end()
  } else {
    logger.error(err.message)
    res.status(500).end()
  }
}

export default errorHandler;
