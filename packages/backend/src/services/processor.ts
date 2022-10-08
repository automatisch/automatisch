import get from 'lodash.get';
import { IJSONObject } from '@automatisch/types';

import App from '../models/app';
import Flow from '../models/flow';
import Step from '../models/step';
import Execution from '../models/execution';
import ExecutionStep from '../models/execution-step';
import globalVariable from '../helpers/global-variable';

type ExecutionSteps = Record<string, ExecutionStep>;

type ProcessorOptions = {
  untilStep?: Step;
  testRun?: boolean;
};

class Processor {
  flow: Flow;
  untilStep?: Step;
  testRun?: boolean;

  static variableRegExp = /({{step\.[\da-zA-Z-]+(?:\.[\da-zA-Z-]+)+}})/g;

  constructor(flow: Flow, processorOptions: ProcessorOptions) {
    this.flow = flow;
    this.untilStep = processorOptions.untilStep;
    this.testRun = processorOptions.testRun;
  }

  async run() {
    const steps = await this.flow
      .$relatedQuery('steps')
      .withGraphFetched('connection')
      .orderBy('position', 'asc');

    const triggerStep = steps.find((step) => step.type === 'trigger');
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const initialTriggerData = await this.getInitialTriggerData(triggerStep!);

    if (!initialTriggerData.error && initialTriggerData.data.length === 0) {
      const lastInternalId = await this.flow.lastInternalId();

      const executionData: Partial<Execution> = {
        flowId: this.flow.id,
        testRun: this.testRun,
      };

      if (lastInternalId) {
        executionData.internalId = lastInternalId;
      }

      await Execution.query().insert(executionData);

      return;
    }

    if (this.testRun && initialTriggerData.data.length > 0) {
      initialTriggerData.data = [initialTriggerData.data[0]];
    }

    if (initialTriggerData.data.length > 1) {
      initialTriggerData.data = initialTriggerData.data.sort(
        (item: IJSONObject, nextItem: IJSONObject) => {
          return (item.id as number) - (nextItem.id as number);
        }
      );
    }

    const executions: Execution[] = [];

    for await (const data of initialTriggerData.data) {
      const execution = await Execution.query().insert({
        flowId: this.flow.id,
        testRun: this.testRun,
        internalId: data.id as string,
      });

      executions.push(execution);

      let previousExecutionStep: ExecutionStep;
      const priorExecutionSteps: ExecutionSteps = {};

      let fetchedActionData: {
        data: IJSONObject | null;
        error: IJSONObject | null;
      } = {
        data: null,
        error: null,
      };

      for await (const step of steps) {
        if (!step.appKey) continue;

        const { appKey, key, type, parameters: rawParameters = {}, id } = step;

        const isTrigger = type === 'trigger';
        const app = await App.findOneByKey(appKey);

        const computedParameters = Processor.computeParameters(
          rawParameters,
          priorExecutionSteps
        );

        const clonedStep = Object.assign({}, step);
        clonedStep.parameters = computedParameters;

        const $ = await globalVariable(
          step.connection,
          app,
          this.flow,
          clonedStep
        );

        if (!isTrigger && key) {
          const command = app.actions.find((action) => action.key === key);
          fetchedActionData = await command.run($);
        }

        if (!isTrigger && fetchedActionData.error) {
          await execution.$relatedQuery('executionSteps').insertAndFetch({
            stepId: id,
            status: 'failure',
            dataIn: null,
            dataOut: computedParameters,
            errorDetails: fetchedActionData.error,
          });

          break;
        }

        previousExecutionStep = await execution
          .$relatedQuery('executionSteps')
          .insertAndFetch({
            stepId: id,
            status: 'success',
            dataIn: isTrigger ? rawParameters : computedParameters,
            dataOut: isTrigger ? data : fetchedActionData.data,
          });

        priorExecutionSteps[id] = previousExecutionStep;

        if (id === this.untilStep?.id) {
          break;
        }
      }
    }

    if (initialTriggerData.error) {
      const executionWithError = await Execution.query().insert({
        flowId: this.flow.id,
        testRun: this.testRun,
      });

      executions.push(executionWithError);

      await executionWithError.$relatedQuery('executionSteps').insertAndFetch({
        stepId: triggerStep.id,
        status: 'failure',
        dataIn: triggerStep.parameters,
        errorDetails: initialTriggerData.error,
      });
    }

    if (!this.testRun) return;

    const lastExecutionStepFromFirstExecution = await executions[0]
      .$relatedQuery('executionSteps')
      .orderBy('created_at', 'desc')
      .first();

    return lastExecutionStepFromFirstExecution;
  }

  async getInitialTriggerData(step: Step) {
    if (!step.appKey || !step.key) return null;

    const app = await App.findOneByKey(step.appKey);
    const $ = await globalVariable(
      step.connection,
      app,
      this.flow,
      step,
    )

    const command = app.triggers.find((trigger) => trigger.key === step.key);

    let fetchedData;

    if (this.testRun) {
      fetchedData = await command.testRun($);
    } else {
      fetchedData = await command.run($);
    }

    return fetchedData;
  }

  static computeParameters(
    parameters: Step['parameters'],
    executionSteps: ExecutionSteps
  ): Step['parameters'] {
    const entries = Object.entries(parameters);
    return entries.reduce((result, [key, value]: [string, unknown]) => {
      if (typeof value === 'string') {
        const parts = value.split(Processor.variableRegExp);

        const computedValue = parts
          .map((part: string) => {
            const isVariable = part.match(Processor.variableRegExp);
            if (isVariable) {
              const stepIdAndKeyPath = part.replace(
                /{{step.|}}/g,
                ''
              ) as string;
              const [stepId, ...keyPaths] = stepIdAndKeyPath.split('.');
              const keyPath = keyPaths.join('.');
              const executionStep = executionSteps[stepId.toString() as string];
              const data = executionStep?.dataOut;
              const dataValue = get(data, keyPath);
              return dataValue;
            }

            return part;
          })
          .join('');

        return {
          ...result,
          [key]: computedValue,
        };
      }

      return result;
    }, {});
  }
}

export default Processor;
