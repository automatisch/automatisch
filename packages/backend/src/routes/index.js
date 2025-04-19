import { Router } from 'express';
import webhooksRouter from './webhooks.js';
import paddleRouter from './paddle.ee.js';
import healthcheckRouter from './healthcheck.js';
import automatischRouter from './api/v1/automatisch.js';
import accessTokensRouter from './api/v1/access-tokens.js';
import usersRouter from './api/v1/users.js';
import paymentRouter from './api/v1/payment.ee.js';
import flowsRouter from './api/v1/flows.js';
import stepsRouter from './api/v1/steps.js';
import appsRouter from './api/v1/apps.js';
import connectionsRouter from './api/v1/connections.js';
import executionsRouter from './api/v1/executions.js';
import samlAuthProvidersRouter from './api/v1/saml-auth-providers.ee.js';
import adminAppsRouter from './api/v1/admin/apps.ee.js';
import adminConfigRouter from './api/v1/admin/config.ee.js';
import adminSamlAuthProvidersRouter from './api/v1/admin/saml-auth-providers.ee.js';
import adminTemplatesRouter from './api/v1/admin/templates.ee.js';
import adminApiTokensRouter from './api/v1/admin/api-tokens.ee.js';
import templatesRouter from './api/v1/templates.ee.js';
import rolesRouter from './api/v1/admin/roles.ee.js';
import permissionsRouter from './api/v1/admin/permissions.ee.js';
import adminUsersRouter from './api/v1/admin/users.ee.js';
import installationUsersRouter from './api/v1/installation/users.js';
import foldersRouter from './api/v1/folders.js';

const router = Router();

// Add a home route for testing
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Automatisch API is running',
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

router.use('/webhooks', webhooksRouter);
router.use('/paddle', paddleRouter);
router.use('/healthcheck', healthcheckRouter);
router.use('/api/v1/automatisch', automatischRouter);
router.use('/api/v1/access-tokens', accessTokensRouter);
router.use('/api/v1/users', usersRouter);
router.use('/api/v1/payment', paymentRouter);
router.use('/api/v1/apps', appsRouter);
router.use('/api/v1/connections', connectionsRouter);
router.use('/api/v1/flows', flowsRouter);
router.use('/api/v1/steps', stepsRouter);
router.use('/api/v1/executions', executionsRouter);
router.use('/api/v1/saml-auth-providers', samlAuthProvidersRouter);
router.use('/api/v1/admin/apps', adminAppsRouter);
router.use('/api/v1/admin/config', adminConfigRouter);
router.use('/api/v1/admin/users', adminUsersRouter);
router.use('/api/v1/admin/roles', rolesRouter);
router.use('/api/v1/admin/permissions', permissionsRouter);
router.use('/api/v1/admin/saml-auth-providers', adminSamlAuthProvidersRouter);
router.use('/api/v1/admin/templates', adminTemplatesRouter);
router.use('/api/v1/admin/api-tokens', adminApiTokensRouter);
router.use('/api/v1/templates', templatesRouter);
router.use('/api/v1/installation/users', installationUsersRouter);
router.use('/api/v1/folders', foldersRouter);

export default router;
