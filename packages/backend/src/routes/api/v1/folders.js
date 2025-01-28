import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import createFolderAction from '../../../controllers/api/v1/folders/create-folder.js';
import updateFolderAction from '../../../controllers/api/v1/folders/update-folder.js';

const router = Router();

router.post('/', authenticateUser, authorizeUser, createFolderAction);
router.patch('/:folderId', authenticateUser, authorizeUser, updateFolderAction);

export default router;
