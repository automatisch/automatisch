import { Router } from 'express';
import getFoldersAction from '../../../controllers/api/v1/users/get-folders.ee.js';

const router = Router();

router.get('/:userId/folders', getFoldersAction);

export default router;
