import { Router } from 'express';
import getMcpServerAction from '@/controllers/internal/api/v1/mcp-servers/get-mcp-server.ee.js';
import getMcpServersAction from '@/controllers/internal/api/v1/mcp-servers/get-mcp-servers.ee.js';
import createMcpServerAction from '@/controllers/internal/api/v1/mcp-servers/create-mcp-server.ee.js';
import updateMcpServerAction from '@/controllers/internal/api/v1/mcp-servers/update-mcp-server.ee.js';
import deleteMcpServerAction from '@/controllers/internal/api/v1/mcp-servers/delete-mcp-server.ee.js';
import createMcpToolsAction from '@/controllers/internal/api/v1/mcp-servers/create-mcp-tools.ee.js';
import getMcpToolsAction from '@/controllers/internal/api/v1/mcp-servers/get-mcp-tools.ee.js';
import deleteMcpToolAction from '@/controllers/internal/api/v1/mcp-servers/delete-mcp-tool.ee.js';
import rotateMcpServerTokenAction from '@/controllers/internal/api/v1/mcp-servers/rotate-mcp-server-token.ee.js';
import getMcpServerExecutionsAction from '@/controllers/internal/api/v1/mcp-servers/get-mcp-tool-executions.ee.js';
import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeUser } from '@/helpers/authorization.js';

const router = Router();

router.get('/', authenticateUser, authorizeUser, getMcpServersAction);
router.post('/', authenticateUser, authorizeUser, createMcpServerAction);
router.get(
  '/:mcpServerId',
  authenticateUser,
  authorizeUser,
  getMcpServerAction
);

router.patch(
  '/:mcpServerId',
  authenticateUser,
  authorizeUser,
  updateMcpServerAction
);

router.delete(
  '/:mcpServerId',
  authenticateUser,
  authorizeUser,
  deleteMcpServerAction
);

router.get(
  '/:mcpServerId/tools',
  authenticateUser,
  authorizeUser,
  getMcpToolsAction
);

router.post(
  '/:mcpServerId/tools',
  authenticateUser,
  authorizeUser,
  createMcpToolsAction
);

router.delete(
  '/:mcpServerId/tools/:mcpToolId',
  authenticateUser,
  authorizeUser,
  deleteMcpToolAction
);

router.post(
  '/:mcpServerId/rotate-token',
  authenticateUser,
  authorizeUser,
  rotateMcpServerTokenAction
);

router.get(
  '/:mcpServerId/executions',
  authenticateUser,
  authorizeUser,
  getMcpServerExecutionsAction
);

export default router;
