import Crypto from 'node:crypto';

import Base from '@/models/base.js';
import User from '@/models/user.js';
import McpTool from '@/models/mcp-tool.ee.js';
import McpToolExecution from '@/models/mcp-tool-execution.ee.js';
import appConfig from '@/config/app.js';
import mcpSessionManager from '@/helpers/mcp-sessions.js';

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
    await mcpSessionManager.notifyToolsListChanged(this.id);
  }

  async terminateSessions() {
    await mcpSessionManager.terminateServerSessions(this.id);
  }

  async createOrUpdateTool({
    connectionId,
    appKey,
    actions,
    type = 'app',
    flowId,
  }) {
    if (type === 'app') {
      await this.$relatedQuery('tools').where('app_key', appKey).delete();
    } else if (type === 'flow' && flowId) {
      await this.$relatedQuery('tools').where('flow_id', flowId).delete();
    }

    const toolData = {
      type,
    };

    if (type === 'app') {
      toolData.connectionId = connectionId;
      toolData.appKey = appKey;
      toolData.actions = actions;
    } else if (type === 'flow') {
      toolData.flowId = flowId;
    }

    const mcpTool = await this.$relatedQuery('tools').insertAndFetch(toolData);

    await this.notifyToolsListChanged();

    return mcpTool;
  }

  async deleteTool(mcpToolId) {
    const mcpTool = await this.$relatedQuery('tools')
      .findById(mcpToolId)
      .throwIfNotFound();

    await mcpTool.$query().delete();

    await this.notifyToolsListChanged();

    return mcpTool;
  }

  async delete() {
    await this.$relatedQuery('tools').delete();
    await this.$query().delete();

    await this.terminateSessions();

    return this;
  }
}

export default McpServer;
