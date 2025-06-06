import { Router } from 'express';
import getFormAction from '@/controllers/internal/api/v1/forms/get-form.ee.js';
import getFormsAction from '@/controllers/internal/api/v1/forms/get-forms.ee.js';
import createFormAction from '@/controllers/internal/api/v1/forms/create-form.ee.js';
import updateFormAction from '@/controllers/internal/api/v1/forms/update-form.ee.js';
import deleteFormAction from '@/controllers/internal/api/v1/forms/delete-form.ee.js';
import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeUser } from '@/helpers/authorization.js';

const router = Router();

router.get('/:formId', authenticateUser, authorizeUser, getFormAction);
router.get('/', authenticateUser, authorizeUser, getFormsAction);
router.post('/', authenticateUser, authorizeUser, createFormAction);
router.patch('/:formId', authenticateUser, authorizeUser, updateFormAction);
router.delete('/:formId', authenticateUser, authorizeUser, deleteFormAction);

export default router;
