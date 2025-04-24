import { Router } from 'express';
import getFoldersAction from '../../../controllers/api/v1/folders/get-folders.ee.js';
import deleteFolderAction from '../../../controllers/api/v1/folders/delete-folder.ee.js';

const router = Router();

router.get('/', getFoldersAction);
router.delete('/:folderId', deleteFolderAction);

export default router;
