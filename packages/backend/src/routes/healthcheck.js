import { Router } from 'express';
import indexAction from '../controllers/healthcheck/index.js';

const router = Router();

router.get('/', indexAction);

export default router;
