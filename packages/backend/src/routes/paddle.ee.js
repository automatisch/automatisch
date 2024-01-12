import { Router } from 'express';
import webhooksHandler from '../controllers/paddle/webhooks.ee.js';

const router = Router();

const exposeError = (handler) => async (req, res, next) => {
  try {
    await handler(req, res, next);
  } catch (err) {
    next(err);
  }
};

router.post('/webhooks', exposeError(webhooksHandler));

export default router;
