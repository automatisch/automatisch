import express, { Router } from 'express';
import multer from 'multer';

import appConfig from '../config/app.js';
import webhookHandlerByFlowId from '../controllers/webhooks/handler-by-flow-id.js';
import webhookHandlerSyncByFlowId from '../controllers/webhooks/handler-sync-by-flow-id.js';
import webhookHandlerByConnectionIdAndRefValue from '../controllers/webhooks/handler-by-connection-id-and-ref-value.js';

const router = Router();
const upload = multer();

router.use(upload.none());

router.use(
  express.text({
    limit: appConfig.requestBodySizeLimit,
    verify(req, res, buf) {
      req.rawBody = buf;
    },
  })
);

const exposeError = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (err) {
    next(err);
  }
};

function createRouteHandler(path, handler) {
  const wrappedHandler = exposeError(handler);

  router
    .route(path)
    .get(wrappedHandler)
    .put(wrappedHandler)
    .patch(wrappedHandler)
    .post(wrappedHandler);
}

createRouteHandler(
  '/connections/:connectionId/:refValue',
  webhookHandlerByConnectionIdAndRefValue
);
createRouteHandler(
  '/connections/:connectionId',
  webhookHandlerByConnectionIdAndRefValue
);
createRouteHandler('/flows/:flowId/sync', webhookHandlerSyncByFlowId);
createRouteHandler('/flows/:flowId', webhookHandlerByFlowId);
createRouteHandler('/:flowId', webhookHandlerByFlowId);

export default router;
