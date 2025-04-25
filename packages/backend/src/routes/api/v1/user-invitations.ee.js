import { Router } from 'express';
import getUserInvitationsAction from '../../../controllers/api/v1/user-invitations/get-user-invitations.ee.js';

const router = Router();

router.get('/', getUserInvitationsAction);

export default router;
