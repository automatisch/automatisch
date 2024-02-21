import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import checkIsCloud from '../../../helpers/check-is-cloud.js';
import getPlansAction from '../../../controllers/api/v1/payment/get-plans.ee.js';

const router = Router();

router.get('/plans', authenticateUser, checkIsCloud, getPlansAction);

export default router;
