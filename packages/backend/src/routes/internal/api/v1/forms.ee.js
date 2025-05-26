import { Router } from 'express';
import getFormAction from '../../../../controllers/internal/api/v1/forms/get-form.ee.js';
import useCreateForm from '../../../../controllers/internal/api/v1/forms/create-form.ee.js';
import useCreateFormSubmission from '../../../../controllers/internal/api/v1/forms/create-form-submission.ee.js';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeUser } from '../../../../helpers/authorization.js';

const router = Router();

router.get('/:formId', authenticateUser, authorizeUser, getFormAction);
router.post('/', authenticateUser, authorizeUser, useCreateForm);
router.post('/:formId', useCreateFormSubmission);

export default router;
