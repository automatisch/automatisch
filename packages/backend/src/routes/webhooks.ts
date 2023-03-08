import express, { Response, Router, NextFunction, RequestHandler } from 'express';
import multer from 'multer';

import { IRequest } from '@automatisch/types';
import appConfig from '../config/app';
import webhookHandler from '../controllers/webhooks/handler';

const router = Router();
const upload = multer();

router.use(upload.none());

router.use(express.text({
  limit: appConfig.requestBodySizeLimit,
  verify(req, res, buf) {
    (req as IRequest).rawBody = buf;
  },
}));

const exposeError = (handler: RequestHandler) => async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    await handler(req, res, next);
  } catch (err) {
    res.status(422).send(err);
  }
}

router.get('/:flowId', exposeError(webhookHandler));
router.put('/:flowId', exposeError(webhookHandler));
router.patch('/:flowId', exposeError(webhookHandler));
router.post('/:flowId', exposeError(webhookHandler));

export default router;
