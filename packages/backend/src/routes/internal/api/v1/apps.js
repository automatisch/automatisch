import { Router } from 'express';
import { authenticateUser } from '../../../../helpers/authentication.js';
import { authorizeUser } from '../../../../helpers/authorization.js';
import { checkIsEnterprise } from '../../../../helpers/check-is-enterprise.js';
import getAppAction from '../../../../controllers/internal/api/v1/apps/get-app.js';
import getAppsAction from '../../../../controllers/internal/api/v1/apps/get-apps.js';
import getAuthAction from '../../../../controllers/internal/api/v1/apps/get-auth.js';
import getConnectionsAction from '../../../../controllers/internal/api/v1/apps/get-connections.js';
import getConfigAction from '../../../../controllers/internal/api/v1/apps/get-config.ee.js';
import getOAuthClientsAction from '../../../../controllers/internal/api/v1/apps/get-oauth-clients.ee.js';
import getOAuthClientAction from '../../../../controllers/internal/api/v1/apps/get-oauth-client.ee.js';
import getTriggersAction from '../../../../controllers/internal/api/v1/apps/get-triggers.js';
import getTriggerSubstepsAction from '../../../../controllers/internal/api/v1/apps/get-trigger-substeps.js';
import getActionsAction from '../../../../controllers/internal/api/v1/apps/get-actions.js';
import getActionSubstepsAction from '../../../../controllers/internal/api/v1/apps/get-action-substeps.js';
import getFlowsAction from '../../../../controllers/internal/api/v1/apps/get-flows.js';
import createConnectionAction from '../../../../controllers/internal/api/v1/apps/create-connection.js';

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

router.post(
  '/:appKey/connections',
  authenticateUser,
  authorizeUser,
  createConnectionAction
);

router.get(
  '/:appKey/config',
  authenticateUser,
  checkIsEnterprise,
  getConfigAction
);

router.get(
  '/:appKey/oauth-clients',
  authenticateUser,
  checkIsEnterprise,
  getOAuthClientsAction
);

router.get(
  '/:appKey/oauth-clients/:oauthClientId',
  authenticateUser,
  checkIsEnterprise,
  getOAuthClientAction
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
