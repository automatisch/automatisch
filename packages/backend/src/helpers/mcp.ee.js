import Crypto from 'node:crypto';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  McpError,
  ErrorCode,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';

import Connection from '@/models/connection.js';
import App from '@/models/app.js';
import Flow from '@/models/flow.js';
import McpServer from '@/models/mcp-server.ee.js';
import globalVariable from '@/engine/global-variable.js';
import Engine from '@/engine/index.js';
import HttpError from '@/errors/http.js';

export function generateSchemaOutOfActionArguments(actionArguments) {
  const schema = Object.fromEntries(
    actionArguments.map(
      ({ key, label, type, description, fields, required, options, value }) => {
        let rule = z.string();

        if (type === 'dynamic' && Array.isArray(fields)) {
          const innerShape = Object.fromEntries(
            fields.map((f) => {
              let innerField = z.string(); // @TODO: may enhance with more types

              if (f.description || f.label) {
                innerField = innerField.describe(
                  f.description || `Parameter: ${f.label}`
                );
              }

              return [f.key, innerField];
            })
          );

          rule = z.array(z.object(innerShape));

          if (required) {
            rule = rule.min(1);
          } else {
            rule = rule.min(0);
          }
        } else if (type === 'dropdown' && options?.length) {
          const values = options.map((opt) => opt.value);

          // Check if all values are numbers
          const allNumbers = values.every((v) => typeof v === 'number');

          if (allNumbers) {
            // For numeric enums, use z.union with z.literal for each value
            rule = z.union(values.map((v) => z.literal(v)));
          } else {
            // For string enums, use z.enum
            rule = z.enum(values);
          }

          if (!required) {
            rule = rule.nullable().optional();
          }
        } else if (type === 'string') {
          if (typeof value === 'string') {
            rule = z.string();
          } else if (typeof value === 'number') {
            rule = z.number();
          }

          if (!required) {
            rule = rule.nullable().optional();
          }
        }

        // Add description
        if (description || label) {
          rule = rule.describe(description || `Parameter: ${label}`);
        }

        return [key, rule];
      }
    )
  );

  return z.object(schema);
}

async function getToolsListFromDatabase(serverId) {
  const mcpServer = await McpServer.query()
    .findById(serverId)
    .throwIfNotFound();

  const mcpTools = await mcpServer
    .$relatedQuery('tools')
    .orderBy('created_at', 'asc');

  const tools = [];

  for (const tool of mcpTools) {
    if (tool.type === 'app') {
      // Handle app-based tools
      const { appKey, action } = tool;
      const app = await App.findOneByKey(appKey);
      const appActions = app.actions || [];

      const appAction = appActions.find(({ key }) => key === action);
      if (appAction) {
        const toolName = `${appKey}_${appAction.key}`;
        const toolSchema = generateSchemaOutOfActionArguments(
          appAction.substeps.find(({ key }) => key === 'chooseTrigger')
            .arguments
        );

        tools.push({
          name: toolName,
          description: appAction.description,
          inputSchema: zodToJsonSchema(toolSchema),
        });
      }
    } else if (tool.type === 'flow') {
      // Handle flow-based tools
      const flow = await Flow.query().findById(tool.flowId);
      if (flow && flow.active) {
        const triggerStep = await flow.getTriggerStep();

        if (
          triggerStep &&
          triggerStep.appKey === 'mcp' &&
          triggerStep.key === 'mcpTool'
        ) {
          const { toolName, toolDescription, inputSchema } =
            triggerStep.parameters;

          let parsedSchema = {};
          if (inputSchema) {
            try {
              parsedSchema = JSON.parse(inputSchema);
            } catch (error) {
              // Use empty schema if parsing fails
              parsedSchema = { type: 'object', properties: {} };
            }
          } else {
            parsedSchema = { type: 'object', properties: {} };
          }

          tools.push({
            name: toolName || `flow_${flow.id}`,
            description: toolDescription || flow.name,
            inputSchema: parsedSchema,
          });
        }
      }
    }
  }

  return tools;
}

async function findToolInDatabase(serverId, toolName) {
  const mcpServer = await McpServer.query()
    .findById(serverId)
    .throwIfNotFound();

  const flowMcpTool = await mcpServer
    .$relatedQuery('tools')
    .where({
      action: toolName,
      type: 'flow',
    })
    .first();

  // First, try to find flow-based tools by toolName
  if (flowMcpTool) {
    const flow = await Flow.query().findById(flowMcpTool.flowId);

    if (flow?.active) {
      const triggerStep = await flow.getTriggerStep();

      if (triggerStep?.appKey === 'mcp' && triggerStep?.key === 'mcpTool') {
        const configuredToolName = triggerStep.parameters.toolName;

        if (configuredToolName === toolName) {
          return {
            type: 'flow',
            tool: flowMcpTool,
            flow,
            triggerStep,
            mcpServer,
          };
        }
      }
    }
  }

  const parts = toolName.split('_');
  const appKey = parts[0];
  const actionKey = parts.slice(1).join('_');

  const appMcpTool = await mcpServer
    .$relatedQuery('tools')
    .where({ app_key: appKey, action: actionKey, type: 'app' })
    .first();

  if (appMcpTool) {
    return { type: 'app', tool: appMcpTool, appKey, actionKey, mcpServer };
  }

  throw new McpError(ErrorCode.ToolNotFound, `Tool not found: ${toolName}`);
}

async function executeAppTool(appKey, actionKey, mcpTool, parameters) {
  const app = await App.findOneByKey(appKey);
  const appAction = app.actions.find(({ key }) => key === actionKey);

  if (!appAction) {
    throw new McpError(
      ErrorCode.ToolNotFound,
      `Action not found: ${actionKey} for app ${appKey}`
    );
  }

  try {
    const $ = await globalVariable({
      app,
      connection: await Connection.query().findById(mcpTool.connectionId),
      testRun: false,
      step: {
        parameters,
      },
    });

    await appAction.run($);
    const actionOutput = $.actionOutput.data;

    await mcpTool.$relatedQuery('mcpToolExecutions').insert({
      dataIn: parameters,
      dataOut: actionOutput.raw,
      status: 'success',
    });

    return formatMcpResponse('success', {
      message: `Successfully invoked action \`${actionKey}\` on app \`${appKey}\``,
      data: actionOutput.raw,
    });
  } catch (err) {
    let error;

    if (err instanceof HttpError) {
      error = err.details;
    } else {
      try {
        error = JSON.parse(err.message);
      } catch {
        error = { error: err.message };
      }
    }

    await mcpTool.$relatedQuery('mcpToolExecutions').insert({
      dataIn: parameters,
      errorDetails: error,
      status: 'failure',
    });

    return formatMcpResponse('error', {
      message: `Failed to invoke action \`${actionKey}\` on \`${appKey}\``,
      error,
    });
  }
}

async function executeFlowTool(matchedTool, toolName, parameters) {
  const { flow } = matchedTool;

  const initialData = {
    raw: parameters,
    meta: {
      internalId: Crypto.randomUUID(),
    },
  };

  const engineResult = await Engine.run({
    flowId: flow.id,
    mcpToolId: matchedTool.tool.id,
    triggeredByMcp: true,
    initialData: [initialData],
  });

  if (engineResult.mcpError) {
    return formatMcpResponse('error', { message: engineResult.mcpError });
  }

  if (engineResult.mcpSuccess) {
    return formatMcpResponse('success', {
      message: engineResult.mcpSuccess,
      data: engineResult.mcpData,
    });
  }
}

function formatMcpResponse(type, data) {
  let text = '';
  const emoji = {
    success: '✅',
    error: '❌',
    info: '🔍',
  };

  if (type === 'success') {
    text = `${emoji.success} ${data.message}`;
    if (data.summary) {
      text += `.\n\n**Execution Summary:**\n${data.summary}`;
    }
    if (data.data) {
      text += `.\n\n**Final Result:**\n\`\`\`json\n${JSON.stringify(
        data.data,
        null,
        2
      )}\n\`\`\``;
    } else if (data.data !== undefined) {
      text += `.\n\n**Response:**\n\`\`\`json\n${JSON.stringify(
        data.data,
        null,
        2
      )}\n\`\`\``;
    }
  } else if (type === 'error') {
    text = `${emoji.error} ${data.message}`;
    if (data.error) {
      text += `. Error: ${JSON.stringify(data.error, null, 2)}`;
    }
  } else if (type === 'info') {
    text = `${emoji.info} ${data.message}`;
  }

  return {
    content: [
      {
        type: 'text',
        text,
      },
    ],
  };
}

async function executeToolFromDatabase(serverId, toolName, parameters) {
  try {
    const matchedTool = await findToolInDatabase(serverId, toolName);

    if (matchedTool.type === 'app') {
      return await executeAppTool(
        matchedTool.appKey,
        matchedTool.actionKey,
        matchedTool.tool,
        parameters
      );
    }

    if (matchedTool.type === 'flow') {
      return await executeFlowTool(matchedTool, toolName, parameters);
    }
  } catch (err) {
    if (err instanceof McpError) {
      throw err;
    }

    return formatMcpResponse('error', {
      message: `Failed to execute tool \`${toolName}\``,
      error: err.message,
    });
  }

  throw new McpError(ErrorCode.ToolNotFound, `Tool not found: ${toolName}`);
}

export async function createMcpServer(serverId) {
  const server = new Server(
    {
      name: 'Automatisch',
      version: '0.0.0',
    },
    {
      capabilities: {
        tools: {
          listChanged: true,
        },
      },
    }
  );

  // Dynamic tools/list handler - queries database at request time
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = await getToolsListFromDatabase(serverId);
    return { tools };
  });

  // Dynamic tools/call handler - finds and executes tools from database
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name: toolName, arguments: parameters } = request.params;
    return await executeToolFromDatabase(serverId, toolName, parameters);
  });

  return server;
}
