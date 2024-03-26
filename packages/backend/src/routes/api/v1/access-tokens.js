import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import createAccessTokenAction from '../../../controllers/api/v1/access-tokens/create-access-token.js';

const router = Router();

router.post('/', asyncHandler(createAccessTokenAction));

export default router;
