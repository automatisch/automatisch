import express, { Router } from 'express';
import multer from 'multer';
import cors from 'cors';

import appConfig from '@/config/app.js';

import webhookHandlerByFlowId from '@/controllers/webhooks/handler-by-flow-id.js';
import webhookHandlerSyncByFlowId from '@/controllers/webhooks/handler-sync-by-flow-id.js';
import { checkIsQuotaExceeded } from '@/middlewares/check-is-quota-exceeded.js';
import { verifyWebhookRequest } from '@/middlewares/verify-webhook.js';

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

router.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,POST,PATCH,DELETE',
    optionsSuccessStatus: 200,
    exposedHeaders: ['X-Redirect-URL'],
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
    .get(checkIsQuotaExceeded, verifyWebhookRequest, wrappedHandler)
    .put(checkIsQuotaExceeded, verifyWebhookRequest, wrappedHandler)
    .patch(checkIsQuotaExceeded, verifyWebhookRequest, wrappedHandler)
    .post(checkIsQuotaExceeded, verifyWebhookRequest, wrappedHandler);
}

createRouteHandler('/flows/:flowId/sync', webhookHandlerSyncByFlowId);
createRouteHandler('/flows/:flowId', webhookHandlerByFlowId);
createRouteHandler('/:flowId', webhookHandlerByFlowId);

export default router;
