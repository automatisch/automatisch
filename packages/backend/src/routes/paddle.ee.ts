import { Response, Router, NextFunction, RequestHandler } from 'express';
import { IRequest } from '@automatisch/types';
import webhooksHandler from '../controllers/paddle/webhooks.ee';

const router = Router();

const exposeError =
  (handler: RequestHandler) =>
    async (req: IRequest, res: Response, next: NextFunction) => {
      try {
        await handler(req, res, next);
      } catch (err) {
        next(err);
      }
    };

router.post('/webhooks', exposeError(webhooksHandler));

export default router;
