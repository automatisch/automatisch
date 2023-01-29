import express, { Router } from 'express';
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

router.get('/:flowId', webhookHandler);
router.put('/:flowId', webhookHandler);
router.patch('/:flowId', webhookHandler);
router.post('/:flowId', webhookHandler);

export default router;
