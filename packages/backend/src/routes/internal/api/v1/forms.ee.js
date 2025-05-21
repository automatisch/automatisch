import { Router } from 'express';
import getFormAction from '../../../../controllers/internal/api/v1/forms/get-form.ee.js';
import useCreateFormSubmission from '../../../../controllers/internal/api/v1/forms/create-form-submission.ee.js';

const router = Router();

router.get('/:formId', getFormAction);
router.post('/:formId', useCreateFormSubmission);

export default router;
