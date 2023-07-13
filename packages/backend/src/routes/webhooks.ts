import express, { Response, Router, NextFunction, RequestHandler } from 'express';
import multer from 'multer';

import { IRequest } from '@automatisch/types';
import appConfig from '../config/app';
import webhookHandlerByFlowId from '../controllers/webhooks/handler-by-flow-id';
import webhookHandlerByConnectionIdAndRefValue from '../controllers/webhooks/handler-by-connection-id-and-ref-value';

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
    next(err);
  }
}

function createRouteHandler(path: string, handler: (req: IRequest, res: Response, next: NextFunction) => void) {
  const wrappedHandler = exposeError(handler);

  router
    .route(path)
    .get(wrappedHandler)
    .put(wrappedHandler)
    .patch(wrappedHandler)
    .post(wrappedHandler);
};

createRouteHandler('/connections/:connectionId/:refValue', webhookHandlerByConnectionIdAndRefValue);
createRouteHandler('/connections/:connectionId', webhookHandlerByConnectionIdAndRefValue);
createRouteHandler('/flows/:flowId', webhookHandlerByFlowId);
createRouteHandler('/:flowId', webhookHandlerByFlowId);

export default router;
