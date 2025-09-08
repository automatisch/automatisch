import { describe, it, expect, vi } from 'vitest';
import { z } from 'zod';

import {
  generateSchemaOutOfActionArguments,
  createMcpServer,
} from '@/helpers/mcp.ee.js';
import { createUser } from '@/factories/user.js';
import { createMcpServer as createMcpServerFactory } from '@/factories/mcp-server.js';
import { createMcpTool } from '@/factories/mcp-tool.js';
import { createFlow } from '@/factories/flow.js';
import { createStep } from '@/factories/step.js';
import { createConnection } from '@/factories/connection.js';
import App from '@/models/app.js';

describe('mcp helper', () => {
  describe('generateSchemaOutOfActionArguments', () => {
    it('should generate schema for string fields', () => {
      const actionArguments = [
        {
          key: 'message',
          label: 'Message',
          type: 'string',
          description: 'The message to send',
          required: true,
        },
        {
          key: 'recipient',
          label: 'Recipient',
          type: 'string',
          required: false,
        },
      ];

      const schema = generateSchemaOutOfActionArguments(actionArguments);

      expect(schema).toBeInstanceOf(z.ZodObject);
      const shape = schema.shape;
      expect(shape.message).toBeDefined();
      expect(shape.recipient).toBeDefined();
      expect(shape.message.description).toBe('The message to send');
      expect(shape.recipient.description).toBe('Parameter: Recipient');
    });

    it('should generate schema for dropdown fields with string options', () => {
      const actionArguments = [
        {
          key: 'priority',
          label: 'Priority',
          type: 'dropdown',
          options: [
            { label: 'Low', value: 'low' },
            { label: 'Medium', value: 'medium' },
            { label: 'High', value: 'high' },
          ],
          required: true,
        },
      ];

      const schema = generateSchemaOutOfActionArguments(actionArguments);
      const shape = schema.shape;

      expect(shape.priority).toBeDefined();

      // Test valid values
      expect(() => schema.parse({ priority: 'low' })).not.toThrow();
      expect(() => schema.parse({ priority: 'medium' })).not.toThrow();
      expect(() => schema.parse({ priority: 'high' })).not.toThrow();

      // Test invalid value
      expect(() => schema.parse({ priority: 'invalid' })).toThrow();
    });

    it('should generate schema for dropdown fields with numeric options', () => {
      const actionArguments = [
        {
          key: 'level',
          label: 'Level',
          type: 'dropdown',
          options: [
            { label: 'Level 1', value: 1 },
            { label: 'Level 2', value: 2 },
            { label: 'Level 3', value: 3 },
          ],
        },
      ];

      const schema = generateSchemaOutOfActionArguments(actionArguments);
      const shape = schema.shape;

      expect(shape.level).toBeDefined();

      // Test valid values
      expect(() => schema.parse({ level: 1 })).not.toThrow();
      expect(() => schema.parse({ level: 2 })).not.toThrow();
      expect(() => schema.parse({ level: 3 })).not.toThrow();

      // Test invalid value
      expect(() => schema.parse({ level: 4 })).toThrow();
    });

    it('should generate schema for dynamic fields with arrays', () => {
      const actionArguments = [
        {
          key: 'items',
          label: 'Items',
          type: 'dynamic',
          required: true,
          fields: [
            {
              key: 'name',
              label: 'Name',
              description: 'Item name',
            },
            {
              key: 'quantity',
              label: 'Quantity',
            },
          ],
        },
      ];

      const schema = generateSchemaOutOfActionArguments(actionArguments);
      const shape = schema.shape;

      expect(shape.items).toBeDefined();

      // Test valid array
      const validData = {
        items: [
          { name: 'Item 1', quantity: '5' },
          { name: 'Item 2', quantity: '10' },
        ],
      };
      expect(() => schema.parse(validData)).not.toThrow();

      // Test empty array (should fail due to required)
      expect(() => schema.parse({ items: [] })).toThrow();
    });

    it('should generate schema for optional dynamic fields', () => {
      const actionArguments = [
        {
          key: 'tags',
          label: 'Tags',
          type: 'dynamic',
          required: false,
          fields: [
            {
              key: 'tag',
              label: 'Tag',
            },
          ],
        },
      ];

      const schema = generateSchemaOutOfActionArguments(actionArguments);

      // Test empty array (should pass since not required)
      expect(() => schema.parse({ tags: [] })).not.toThrow();

      // Test with data
      expect(() =>
        schema.parse({ tags: [{ tag: 'important' }] })
      ).not.toThrow();
    });

    it('should handle fields with numeric values', () => {
      const actionArguments = [
        {
          key: 'count',
          label: 'Count',
          type: 'string',
          value: 42, // numeric value
        },
      ];

      const schema = generateSchemaOutOfActionArguments(actionArguments);
      const shape = schema.shape;

      expect(shape.count).toBeDefined();

      // Should expect a number due to the numeric value
      expect(() => schema.parse({ count: 42 })).not.toThrow();
    });
  });

  describe('createMcpServer', () => {
    it('should create an MCP server with tools handlers', async () => {
      const user = await createUser();
      const mcpServer = await createMcpServerFactory({
        userId: user.id,
        name: 'Test Server',
      });

      const connection = await createConnection({
        userId: user.id,
      });

      // Create app tool
      await createMcpTool({
        mcpServerId: mcpServer.id,
        connectionId: connection.id,
        appKey: 'slack',
        action: 'sendMessage',
        type: 'app',
      });

      // Create flow tool
      const flow = await createFlow({
        userId: user.id,
        name: 'Test Flow',
        active: true,
      });

      await createStep({
        flowId: flow.id,
        type: 'trigger',
        appKey: 'mcp',
        key: 'mcpTool',
        parameters: {
          toolName: 'test_flow_tool',
          toolDescription: 'A test flow tool',
          inputSchema: JSON.stringify({
            type: 'object',
            properties: {
              input: { type: 'string' },
            },
          }),
        },
      });

      await createMcpTool({
        mcpServerId: mcpServer.id,
        flowId: flow.id,
        action: 'test_flow_tool',
        type: 'flow',
      });

      // Mock App.findOneByKey
      vi.spyOn(App, 'findOneByKey').mockResolvedValue({
        actions: [
          {
            key: 'sendMessage',
            description: 'Send a message',
            substeps: [
              {
                key: 'chooseTrigger',
                arguments: [
                  {
                    key: 'text',
                    label: 'Text',
                    type: 'string',
                    required: true,
                  },
                ],
              },
            ],
            run: vi.fn(),
          },
        ],
      });

      const server = await createMcpServer(mcpServer.id);

      expect(server).toBeDefined();
      expect(server.constructor.name).toBe('Server');

      // Verify tools handler is registered
      expect(server._requestHandlers).toBeDefined();
      expect(server._requestHandlers.has('tools/list')).toBe(true);
      expect(server._requestHandlers.has('tools/call')).toBe(true);
    });

    it('should handle server without tools', async () => {
      const user = await createUser();
      const mcpServer = await createMcpServerFactory({
        userId: user.id,
        name: 'Empty Server',
      });

      const server = await createMcpServer(mcpServer.id);

      expect(server).toBeDefined();
      expect(server.constructor.name).toBe('Server');
    });

    it('should create server instance even for non-existent server ID', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

      const server = await createMcpServer(nonExistentId);

      expect(server).toBeDefined();
      expect(server.constructor.name).toBe('Server');
      // The error would only occur when trying to list tools
      expect(server._requestHandlers.has('tools/list')).toBe(true);
    });
  });

});
