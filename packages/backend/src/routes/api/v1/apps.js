import { Router } from 'express';
import { authenticateUser } from '../../../helpers/authentication.js';
import { authorizeUser } from '../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../helpers/check-is-enterprise.js';
import getAppAction from '../../../controllers/api/v1/apps/get-app.js';
import getAppsAction from '../../../controllers/api/v1/apps/get-apps.js';
import getAuthAction from '../../../controllers/api/v1/apps/get-auth.js';
import getConnectionsAction from '../../../controllers/api/v1/apps/get-connections.js';
import getConfigAction from '../../../controllers/api/v1/apps/get-config.ee.js';
import getAuthClientsAction from '../../../controllers/api/v1/apps/get-auth-clients.ee.js';
import getAuthClientAction from '../../../controllers/api/v1/apps/get-auth-client.ee.js';
import getTriggersAction from '../../../controllers/api/v1/apps/get-triggers.js';
import getTriggerSubstepsAction from '../../../controllers/api/v1/apps/get-trigger-substeps.js';
import getActionsAction from '../../../controllers/api/v1/apps/get-actions.js';
import getActionSubstepsAction from '../../../controllers/api/v1/apps/get-action-substeps.js';
import getFlowsAction from '../../../controllers/api/v1/apps/get-flows.js';

const router = Router();

router.get('/', authenticateUser, getAppsAction);
router.get('/:appKey', authenticateUser, getAppAction);
router.get('/:appKey/auth', authenticateUser, getAuthAction);

router.get(
  '/:appKey/connections',
  authenticateUser,
  authorizeUser,
  getConnectionsAction
);

router.get(
  '/:appKey/config',
  authenticateUser,
  checkIsEnterprise,
  getConfigAction
);

router.get(
  '/:appKey/auth-clients',
  authenticateUser,
  checkIsEnterprise,
  getAuthClientsAction
);

router.get(
  '/:appKey/auth-clients/:appAuthClientId',
  authenticateUser,
  checkIsEnterprise,
  getAuthClientAction
);

router.get('/:appKey/triggers', authenticateUser, getTriggersAction);

router.get(
  '/:appKey/triggers/:triggerKey/substeps',
  authenticateUser,
  getTriggerSubstepsAction
);

router.get('/:appKey/actions', authenticateUser, getActionsAction);

router.get(
  '/:appKey/actions/:actionKey/substeps',
  authenticateUser,
  getActionSubstepsAction
);

router.get('/:appKey/flows', authenticateUser, authorizeUser, getFlowsAction);

export default router;
