import { Router } from 'express';
import createFolderAction from '../../../controllers/api/v1/users/create-folder.ee.js';
import getFoldersAction from '../../../controllers/api/v1/users/get-folders.ee.js';
import getUserAction from '../../../controllers/api/v1/users/get-user.ee.js';
import deleteUserAction from '../../../controllers/api/v1/users/delete-user.ee.js';
import getUsersAction from '../../../controllers/api/v1/users/get-users.ee.js';
import deleteFolderAction from '../../../controllers/api/v1/users/delete-folder.ee.js';
import updateFolderAction from '../../../controllers/api/v1/users/update-folder.ee.js';
const router = Router();

router.get('/', getUsersAction);
router.get('/:userId', getUserAction);
router.delete('/:userId', deleteUserAction);
router.get('/:userId/folders', getFoldersAction);
router.post('/:userId/folders', createFolderAction);
router.patch('/:userId/folders/:folderId', updateFolderAction);
router.delete('/:userId/folders/:folderId', deleteFolderAction);

export default router;
