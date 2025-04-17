import { Router } from 'express';
import webhooksRouter from './webhooks.js';
import paddleRouter from './paddle.ee.js';
import healthcheckRouter from './healthcheck.js';
import automatischRouter from './internal/api/v1/automatisch.js';
import accessTokensRouter from './internal/api/v1/access-tokens.js';
import usersRouter from './internal/api/v1/users.js';
import paymentRouter from './internal/api/v1/payment.ee.js';
import flowsRouter from './internal/api/v1/flows.js';
import stepsRouter from './internal/api/v1/steps.js';
import appsRouter from './internal/api/v1/apps.js';
import connectionsRouter from './internal/api/v1/connections.js';
import executionsRouter from './internal/api/v1/executions.js';
import samlAuthProvidersRouter from './internal/api/v1/saml-auth-providers.ee.js';
import adminAppsRouter from './internal/api/v1/admin/apps.ee.js';
import adminConfigRouter from './internal/api/v1/admin/config.ee.js';
import adminSamlAuthProvidersRouter from './internal/api/v1/admin/saml-auth-providers.ee.js';
import adminTemplatesRouter from './internal/api/v1/admin/templates.ee.js';
import adminApiTokensRouter from './internal/api/v1/admin/api-tokens.ee.js';
import templatesRouter from './internal/api/v1/templates.ee.js';
import rolesRouter from './internal/api/v1/admin/roles.ee.js';
import permissionsRouter from './internal/api/v1/admin/permissions.ee.js';
import adminUsersRouter from './internal/api/v1/admin/users.ee.js';
import installationUsersRouter from './internal/api/v1/installation/users.js';
import foldersRouter from './internal/api/v1/folders.js';

const router = Router();

router.use('/webhooks', webhooksRouter);
router.use('/paddle', paddleRouter);
router.use('/healthcheck', healthcheckRouter);

router.use('/internal/api/v1/automatisch', automatischRouter);
router.use('/internal/api/v1/access-tokens', accessTokensRouter);
router.use('/internal/api/v1/users', usersRouter);
router.use('/internal/api/v1/payment', paymentRouter);
router.use('/internal/api/v1/apps', appsRouter);
router.use('/internal/api/v1/connections', connectionsRouter);
router.use('/internal/api/v1/flows', flowsRouter);
router.use('/internal/api/v1/steps', stepsRouter);
router.use('/internal/api/v1/executions', executionsRouter);
router.use('/internal/api/v1/saml-auth-providers', samlAuthProvidersRouter);
router.use('/internal/api/v1/admin/apps', adminAppsRouter);
router.use('/internal/api/v1/admin/config', adminConfigRouter);
router.use('/internal/api/v1/admin/users', adminUsersRouter);
router.use('/internal/api/v1/admin/roles', rolesRouter);
router.use('/internal/api/v1/admin/permissions', permissionsRouter);
router.use(
  '/internal/api/v1/admin/saml-auth-providers',
  adminSamlAuthProvidersRouter
);
router.use('/internal/api/v1/admin/templates', adminTemplatesRouter);
router.use('/internal/api/v1/admin/api-tokens', adminApiTokensRouter);
router.use('/internal/api/v1/templates', templatesRouter);
router.use('/internal/api/v1/installation/users', installationUsersRouter);
router.use('/internal/api/v1/folders', foldersRouter);

export default router;
