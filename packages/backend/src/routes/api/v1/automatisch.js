import { Router } from 'express';
import versionAction from '../../../controllers/api/v1/automatisch/version.js';

const router = Router();

router.get('/version', versionAction);

export default router;
