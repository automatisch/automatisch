import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import indexAction from '../controllers/healthcheck/index.js';

const router = Router();

router.get('/', asyncHandler(indexAction));

export default router;
