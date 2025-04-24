import { Router } from 'express';
import getFoldersAction from '../../../controllers/api/v1/users/get-folders.ee.js';
import createFolderAction from '../../../controllers/api/v1/users/create-folder.ee.js';
import createFlowAction from '../../../controllers/api/v1/users/create-flow.ee.js';

const router = Router();

router.post('/:userId/flows', createFlowAction);
router.get('/:userId/folders', getFoldersAction);
router.post('/:userId/folders', createFolderAction);

export default router;
