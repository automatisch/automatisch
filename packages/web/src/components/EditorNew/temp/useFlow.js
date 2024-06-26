import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { insertStep } from '../utils';

const initFlow = {
  id: '7c55e6ce-a84a-46e3-ba31-211ec7b5c2cb',
  name: 'Name your flow',
  active: false,
  status: 'draft',
  createdAt: 1718264916266,
  updatedAt: 1718264916266,
  steps: [
    {
      id: '82ce34ab-7aab-4e6c-9f62-db5104aa81c6',
      type: 'trigger',
      key: null,
      appKey: null,
      iconUrl: null,
      webhookUrl: 'http://localhost:3000/null',
      status: 'incomplete',
      position: 1,
      parameters: {},
    },
    {
      id: '41c60527-eb4f-4f2d-93ec-2fd37e336909',
      type: 'action',
      key: null,
      appKey: null,
      iconUrl: null,
      webhookUrl: 'http://localhost:3000/null',
      status: 'incomplete',
      position: 2,
      parameters: {},
    },
  ],
};

const generateStep = () => {
  return {
    id: uuidv4(),
    type: 'action',
    key: null,
    appKey: null,
    parameters: {},
    iconUrl: null,
    webhookUrl: 'http://localhost:3000/null',
    status: 'incomplete',
    connection: null,
    position: null,
  };
};

const generatePath = (steps) => {
  return {
    id: uuidv4(),
    type: 'path',
    steps: steps?.length > 0 ? steps : [generateStep()],
  };
};

export const generatePaths = (steps) => {
  return {
    id: uuidv4(),
    type: 'parallelPaths',
    steps: [generatePath(steps), generatePath()],
  };
};

export const useFlow = () => {
  const [flow, setFlow] = useState(initFlow);

  const createStep = (flow, previousStepId) => {
    const newStep = generateStep();
    const newFlow = insertStep(flow, previousStepId, newStep);

    setFlow(newFlow);
    return newStep.id;
  };

  const createPaths = (previousStepId) => {
    const newFlow = insertStep(flow, previousStepId, generatePaths());
    setFlow(newFlow);
  };

  const createPath = (previousStepId) => {
    const newFlow = insertStep(flow, previousStepId, generatePath());
    setFlow(newFlow);
  };

  return {
    flow,
    createStep,
    createPaths,
    createPath,
  };
};
