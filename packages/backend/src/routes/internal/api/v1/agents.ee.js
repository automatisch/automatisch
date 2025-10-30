import { Router } from 'express';
import createAgentAction from '@/controllers/internal/api/v1/agents/create-agent.ee.js';
import getAgentAction from '@/controllers/internal/api/v1/agents/get-agent.ee.js';
import deleteAgentAction from '@/controllers/internal/api/v1/agents/delete-agent.ee.js';
import updateAgentAction from '@/controllers/internal/api/v1/agents/update-agent.ee.js';
import getAgentsAction from '@/controllers/internal/api/v1/agents/get-agents.ee.js';
import getAgentExecutionsAction from '@/controllers/internal/api/v1/agents/get-agent-executions.ee.js';
import getAgentExecutionAction from '@/controllers/internal/api/v1/agents/get-agent-execution.ee.js';
import createAgentToolAction from '@/controllers/internal/api/v1/agents/create-agent-tool.ee.js';
import getAgentToolsAction from '@/controllers/internal/api/v1/agents/get-agent-tools.ee.js';
import deleteAgentToolAction from '@/controllers/internal/api/v1/agents/delete-agent-tool.ee.js';
import testAgentAction from '@/controllers/internal/api/v1/agents/test-agent.ee.js';
import { authenticateUser } from '@/helpers/authentication.js';
import { authorizeUser } from '@/helpers/authorization.js';

const router = Router();

router.post('/', authenticateUser, authorizeUser, createAgentAction);
router.get('/:agentId', authenticateUser, authorizeUser, getAgentAction);
router.delete('/:agentId', authenticateUser, authorizeUser, deleteAgentAction);
router.patch('/:agentId', authenticateUser, authorizeUser, updateAgentAction);
router.post('/:agentId/test', authenticateUser, authorizeUser, testAgentAction);
router.get('/', authenticateUser, authorizeUser, getAgentsAction);

router.get(
  '/:agentId/executions',
  authenticateUser,
  authorizeUser,
  getAgentExecutionsAction
);

router.get(
  '/:agentId/executions/:executionId',
  authenticateUser,
  authorizeUser,
  getAgentExecutionAction
);

router.get(
  '/:agentId/tools',
  authenticateUser,
  authorizeUser,
  getAgentToolsAction
);

router.post(
  '/:agentId/tools',
  authenticateUser,
  authorizeUser,
  createAgentToolAction
);

router.delete(
  '/:agentId/tools/:toolId',
  authenticateUser,
  authorizeUser,
  deleteAgentToolAction
);

export default router;
