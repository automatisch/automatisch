import { AgentExecutor, createToolCallingAgent } from 'langchain/agents';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatOpenAI } from '@langchain/openai';
import { tool } from '@langchain/core/tools';
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from '@langchain/core/prompts';
import { HumanMessage, AIMessage } from '@langchain/core/messages';

import { generateSchemaOutOfActionArguments } from '@/helpers/mcp.ee.js';
import Config from '@/models/config.js';
import AgentTool from '@/models/agent-tool.ee.js';
import App from '@/models/app.js';
import Connection from '@/models/connection.js';
import globalVariable from '@/engine/global-variable.js';

const providers = {
  anthropic: ChatAnthropic,
  openai: ChatOpenAI,
};

const defaultModels = {
  anthropic: 'claude-3-5-sonnet-20241022',
  openai: 'gpt-4o',
};

export async function getAgentTools(agentId) {
  const agentTools = await AgentTool.query().where({ agent_id: agentId });
  return agentTools;
}

export async function generateTools(agentTools) {
  const tools = [];
  for (const agentTool of agentTools) {
    if (agentTool.type === 'app') {
      // Handle app-based tools
      const { appKey, actions } = agentTool;
      const app = await App.findOneByKey(appKey);
      const appActions = app.actions || [];

      for (const actionKey of actions) {
        const appAction = appActions.find(({ key }) => key === actionKey);
        if (appAction) {
          const toolName = `${appKey}_${appAction.key}`;
          const toolSchema = generateSchemaOutOfActionArguments(
            appAction.substeps.find(({ key }) => key === 'chooseTrigger')
              .arguments
          );

          const toolInstance = tool(
            async (input) => {
              const $ = await globalVariable({
                app,
                connection: await Connection.query().findById(
                  agentTool.connectionId
                ),
                testRun: false,
                step: {
                  parameters: input,
                },
              });

              console.log(
                `Running tool: ${appKey}.${toolName} with input:`,
                input
              );

              try {
                await appAction.run($);
                const actionOutput = $.actionOutput.data;

                return JSON.stringify(actionOutput.raw);
              } catch (error) {
                console.log(`Error running tool ${appKey}.${toolName}:`, error);
                return '';
              }
            },
            {
              name: toolName,
              description: appAction.description,
              schema: toolSchema,
            }
          );

          tools.push(toolInstance);
        }
      }
    }
    // TODO: cover flow agent tools
  }

  return tools;
}

export default async function runAgent(agent, { prompt, messages }) {
  // Validate input - must have either prompt or messages
  if (!prompt && !messages) {
    throw new Error('Either prompt or messages must be provided');
  }

  const { provider, key } = await Config.getDefaultAiProviderWithKey();

  const ProviderClass = providers[provider];
  const providerApiKey = key;
  const defaultModel = defaultModels[provider];

  const agentTools = await getAgentTools(agent.id);
  const tools = await generateTools(agentTools);

  const llm = new ProviderClass({
    model: defaultModel,
    apiKey: providerApiKey,
    temperature: 0,
  });

  // Handle conversation mode with message history
  let promptTemplate;
  let invokeParams;
  let userPrompt;

  if (messages && messages.length > 0) {
    // Conversation mode with history
    const chatHistory = [];

    // Convert all messages except the last one to chat history
    for (const message of messages.slice(0, -1)) {
      if (message.role === 'user') {
        chatHistory.push(new HumanMessage(message.content));
      } else if (message.role === 'assistant') {
        chatHistory.push(new AIMessage(message.content));
      }
    }

    // Get the latest user message
    const latestMessage = messages[messages.length - 1];
    if (latestMessage.role !== 'user') {
      throw new Error('Last message must be from user');
    }

    userPrompt = latestMessage.content;

    // Create prompt template with message history
    promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', '{system_instructions}'],
      new MessagesPlaceholder('chat_history'),
      ['human', '{input}'],
      new MessagesPlaceholder('agent_scratchpad'),
    ]);

    invokeParams = {
      input: userPrompt,
      system_instructions: agent.instructions || 'You are a helpful assistant.',
      chat_history: chatHistory,
    };
  } else {
    // Simple mode with just a prompt
    userPrompt = prompt;

    promptTemplate = ChatPromptTemplate.fromMessages([
      ['system', '{system_instructions}'],
      ['human', '{input}'],
      ['placeholder', '{agent_scratchpad}'],
    ]);

    invokeParams = {
      input: userPrompt,
      system_instructions: agent.instructions || 'You are a helpful assistant.',
    };
  }

  const toolCallingAgent = await createToolCallingAgent({
    llm,
    tools,
    prompt: promptTemplate,
  });

  const agentExecutor = new AgentExecutor({
    agent: toolCallingAgent,
    tools,
    verbose: false,
  });

  try {
    const result = await agentExecutor.invoke(invokeParams);

    const executionData = {
      output: result.output,
      intermediateSteps: result.intermediateSteps || [],
    };

    const outputText = result.output?.[0]?.text || result.output;

    await agent.$relatedQuery('agentExecutions').insert({
      agentId: agent.id,
      prompt: userPrompt,
      output: outputText,
      status: 'completed',
      finishedAt: new Date().toISOString(),
    });

    return executionData;
  } catch (error) {
    console.error('Agent execution error:', error);

    await agent.$relatedQuery('agentExecutions').insert({
      agentId: agent.id,
      prompt: userPrompt,
      output: error.message,
      status: 'failed',
      finishedAt: new Date().toISOString(),
    });

    throw new Error(`Agent execution failed: ${error.message}`);
  }
}
