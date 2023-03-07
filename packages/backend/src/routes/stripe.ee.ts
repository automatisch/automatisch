import express, { Router } from 'express';
import multer from 'multer';
import { IRequest } from '@automatisch/types';
import appConfig from '../config/app';
import stripeWebhooksAction from '../controllers/stripe/webhooks.ee';

const router = Router();
const upload = multer();

router.use(upload.none());

router.use(
  express.text({
    limit: appConfig.requestBodySizeLimit,
    verify(req, res, buf) {
      (req as IRequest).rawBody = buf;
    },
  })
);

router.post('/webhooks', stripeWebhooksAction);

export default router;
