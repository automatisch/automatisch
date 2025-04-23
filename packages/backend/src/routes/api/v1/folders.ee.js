import { Router } from 'express';
import getFoldersAction from '../../../controllers/api/v1/folders/get-folders.ee.js';

const router = Router();

router.get('/', getFoldersAction);

export default router;
