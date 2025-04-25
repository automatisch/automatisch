import { Router } from 'express';
import getUserInvitationsAction from '../../../controllers/api/v1/user-invitations/get-user-invitations.ee.js';
import createUserInvitationAction from '../../../controllers/api/v1/user-invitations/create-user-invitation.ee.js';
import deleteUserInvitationAction from '../../../controllers/api/v1/user-invitations/delete-user-invitation.ee.js';

const router = Router();

router.get('/', getUserInvitationsAction);
router.post('/', createUserInvitationAction);
router.delete('/:userId', deleteUserInvitationAction);

export default router;
