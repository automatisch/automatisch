import Crypto from 'node:crypto';

import Base from '@/models/base.js';
import User from '@/models/user.js';
import McpTool from '@/models/mcp-tool.ee.js';
import McpToolExecution from '@/models/mcp-tool-execution.ee.js';
import McpSession from '@/models/mcp-session.ee.js';
import appConfig from '@/config/app.js';
import Flow from '@/models/flow.js';

class McpServer extends Base {
  static tableName = 'mcp_servers';

  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      token: { type: 'string', format: 'uuid' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
  };

  static relationMappings = () => ({
    mcpToolExecutions: {
      relation: Base.ManyToManyRelation,
      modelClass: McpToolExecution,
      join: {
        from: 'mcp_servers.id',
        through: {
          from: 'mcp_tools.mcp_server_id',
          to: 'mcp_tools.id',
        },
        to: 'mcp_tool_executions.mcp_tool_id',
      },
    },
    mcpSessions: {
      relation: Base.HasManyRelation,
      modelClass: McpSession,
      join: {
        from: 'mcp_servers.id',
        to: 'mcp_sessions.mcp_server_id',
      },
    },
    tools: {
      relation: Base.HasManyRelation,
      modelClass: McpTool,
      join: {
        from: 'mcp_servers.id',
        to: 'mcp_tools.mcp_server_id',
      },
    },
    user: {
      relation: Base.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'users.id',
        to: 'mcp_servers.user_id',
      },
    },
  });

  generateToken() {
    this.token = Crypto.randomUUID();
  }

  async rotateToken() {
    this.generateToken();

    const updatedMcpServer = await this.$query().patchAndFetch({
      token: this.token,
    });

    await this.terminateSessions();

    return updatedMcpServer;
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    this.generateToken();
  }

  get serverUrl() {
    return `${appConfig.baseUrl}/api/v1/mcp/${this.token}`;
  }

  async notifyToolsListChanged() {
    await McpSession.notifyToolsListChanged(this.id);
  }

  async terminateSessions() {
    await McpSession.terminateServerSessions(this.id);
  }

  async createTool({ connectionId, appKey, action, type = 'app', flowId }) {
    const toolData = {
      type,
    };

    if (type === 'app') {
      toolData.connectionId = connectionId;
      toolData.appKey = appKey;
      toolData.action = action;

      const alreadyExists = await this.$relatedQuery('tools')
        .where({ app_key: appKey, action, type: 'app' })
        .first();

      if (alreadyExists) {
        throw new Error('Tool with the same app and action already exists');
      }
    } else if (type === 'flow') {
      const flow = await Flow.query().findById(flowId).throwIfNotFound();
      const triggerStep = await flow.getTriggerStep();

      toolData.flowId = flowId;
      toolData.action = triggerStep.parameters.toolName;

      const alreadyExists = await this.$relatedQuery('tools')
        .where({ type: 'flow', flow_id: flowId })
        .first();

      if (alreadyExists) {
        throw new Error('Flow tool with the same flow already exists');
      }
    }

    const mcpTool = await this.$relatedQuery('tools').insertAndFetch(toolData);

    await this.notifyToolsListChanged();

    return mcpTool;
  }

  async deleteTool(mcpToolId) {
    const mcpTool = await this.$relatedQuery('tools')
      .findById(mcpToolId)
      .throwIfNotFound();

    await mcpTool.$relatedQuery('mcpToolExecutions').delete();
    await mcpTool.$query().delete();

    await this.notifyToolsListChanged();

    return mcpTool;
  }

  async delete() {
    await this.$relatedQuery('mcpToolExecutions').delete();
    await this.$relatedQuery('tools').delete();
    await this.$relatedQuery('mcpSessions').delete();
    await this.$query().delete();

    await this.terminateSessions();

    return this;
  }
}

export default McpServer;
