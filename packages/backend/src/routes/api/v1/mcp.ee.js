import { Router } from 'express';

import handleMcpRequestAction from '@/controllers/api/v1/mcp/handle-mcp-request.ee.js';
import deleteMcpSessionAction from '@/controllers/api/v1/mcp/delete-mcp-session.ee.js';
import findMcpTransport from '@/helpers/find-mcp-transport.ee.js';

const router = Router();

router.post('/:mcpServerToken', findMcpTransport, handleMcpRequestAction);
router.get('/:mcpServerToken', findMcpTransport, handleMcpRequestAction);
router.delete('/:mcpServerToken', findMcpTransport, deleteMcpSessionAction);

export default router;
