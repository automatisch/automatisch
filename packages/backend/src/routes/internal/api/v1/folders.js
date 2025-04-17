import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeUser } from '../../../../helpers/authorization.js';
import getFoldersAction from '../../../../controllers/internal/api/v1/folders/get-folders.js';
import createFolderAction from '../../../../controllers/internal/api/v1/folders/create-folder.js';
import updateFolderAction from '../../../../controllers/internal/api/v1/folders/update-folder.js';
import deleteFolderAction from '../../../../controllers/internal/api/v1/folders/delete-folder.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getFoldersAction);
router.post('/', authenticateUser, authorizeUser, createFolderAction);
router.patch('/:folderId', authenticateUser, authorizeUser, updateFolderAction);

router.delete(
  '/:folderId',
  authenticateUser,
  authorizeUser,
  deleteFolderAction
);

export default router;
