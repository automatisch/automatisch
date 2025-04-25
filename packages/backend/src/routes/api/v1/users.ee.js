import { Router } from 'express';
import createFlowAction from '../../../controllers/api/v1/users/create-flow.ee.js';
import createFolderAction from '../../../controllers/api/v1/users/create-folder.ee.js';
import getFoldersAction from '../../../controllers/api/v1/users/get-folders.ee.js';
import getUserAction from '../../../controllers/api/v1/users/get-user.ee.js';
import getUsersAction from '../../../controllers/api/v1/users/get-users.ee.js';

const router = Router();

router.get('/', getUsersAction);
router.get('/:userId', getUserAction);
router.post('/:userId/flows', createFlowAction);
router.get('/:userId/folders', getFoldersAction);
router.post('/:userId/folders', createFolderAction);

export default router;
