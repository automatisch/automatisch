import get from 'lodash.get';
import App from '../models/app';
import Flow from '../models/flow';
import Step from '../models/step';
import Execution from '../models/execution';
import ExecutionStep from '../models/execution-step';

type ExecutionSteps = Record<string, ExecutionStep>;

type ProcessorOptions = {
  untilStep?: Step;
  testRun?: boolean;
};

class Processor {
  flow: Flow;
  untilStep: Step;
  testRun: boolean;

  static variableRegExp = /({{step\..+\..+}})/g;

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
    let initialTriggerData = await this.getInitialTriggerData(triggerStep);

    if (this.testRun) {
      initialTriggerData = [initialTriggerData[0]];
    }

    const executions: Execution[] = [];

    for await (const data of initialTriggerData) {
      const execution = await Execution.query().insert({
        flowId: this.flow.id,
        testRun: this.testRun,
      });

      executions.push(execution);

      let previousExecutionStep: ExecutionStep;
      const priorExecutionSteps: ExecutionSteps = {};
      let fetchedActionData = {};

      for await (const step of steps) {
        const appData = App.findOneByKey(step.appKey);

        const {
          appKey,
          connection,
          key,
          type,
          parameters: rawParameters = {},
          id,
        } = step;

        const isTrigger = type === 'trigger';
        const AppClass = (await import(`../apps/${appKey}`)).default;

        const computedParameters = Processor.computeParameters(
          rawParameters,
          priorExecutionSteps
        );

        const appInstance = new AppClass(
          appData,
          connection.formattedData,
          computedParameters
        );

        if (!isTrigger) {
          const command = appInstance.actions[key];
          fetchedActionData = await command.run();
        }

        previousExecutionStep = await execution
          .$relatedQuery('executionSteps')
          .insertAndFetch({
            stepId: id,
            status: 'success',
            dataIn: isTrigger ? rawParameters : computedParameters,
            dataOut: isTrigger ? data : fetchedActionData,
          });

        priorExecutionSteps[id] = previousExecutionStep;

        if (id === this.untilStep?.id) {
          break;
        }
      }
    }

    if (!this.testRun) return;

    const lastExecutionStepFromFirstExecution = await executions[0]
      .$relatedQuery('executionSteps')
      .orderBy('created_at', 'desc')
      .first();

    return lastExecutionStepFromFirstExecution.dataOut;
  }

  async getInitialTriggerData(step: Step) {
    const appData = App.findOneByKey(step.appKey);
    const { appKey, connection, key, parameters: rawParameters = {} } = step;

    const AppClass = (await import(`../apps/${appKey}`)).default;
    const appInstance = new AppClass(
      appData,
      connection.formattedData,
      rawParameters
    );

    const lastExecutionStep = await step
      .$relatedQuery('executionSteps')
      .orderBy('created_at', 'desc')
      .first();

    const lastExecutionStepCratedAt = lastExecutionStep?.dataOut
      ?.created_at as string;
    const flow = (await step.$relatedQuery('flow')) as Flow;

    const command = appInstance.triggers[key];

    const startTime = new Date(lastExecutionStepCratedAt || flow.updatedAt);
    let fetchedData;

    if (this.testRun) {
      fetchedData = await command.testRun(startTime);
    } else {
      fetchedData = await command.run(startTime);
    }

    return fetchedData;
  }

  static computeParameters(
    parameters: Step['parameters'],
    executionSteps: ExecutionSteps
  ): Step['parameters'] {
    const entries = Object.entries(parameters);
    return entries.reduce((result, [key, value]: [string, string]) => {
      const parts = value.split(Processor.variableRegExp);

      const computedValue = parts
        .map((part: string) => {
          const isVariable = part.match(Processor.variableRegExp);
          if (isVariable) {
            const stepIdAndKeyPath = part.replace(/{{step.|}}/g, '') as string;
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
    }, {});
  }
}

export default Processor;
