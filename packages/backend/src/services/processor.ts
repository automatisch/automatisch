import get from 'lodash.get';
import App from '../models/app';
import Flow from '../models/flow';
import Step from '../models/step';
import Execution from '../models/execution';
import ExecutionStep from '../models/execution-step';

type ExecutionSteps = Record<string, ExecutionStep>;

class Processor {
  flow: Flow;
  untilStep: Step;

  static variableRegExp = /({{step\.\d*\..+?}})/g;

  constructor(flow: Flow, untilStep: Step) {
    this.flow = flow;
    this.untilStep = untilStep;
  }

  async run() {
    const steps = await this.flow
      .$relatedQuery('steps')
      .withGraphFetched('connection')
      .orderBy('position', 'asc');

    const execution = await Execution.query().insert({
      flowId: this.flow.id,
      testRun: true,
    });

    let previousExecutionStep: ExecutionStep;
    let fetchedData;
    const priorExecutionSteps: ExecutionSteps = {};

    for await (const step of steps) {
      const appData = App.findOneByKey(step.appKey);
      const {
        appKey,
        connection,
        key,
        type,
        parameters: rawParameters = {},
        id
      } = step;
      const isTrigger = type === 'trigger';
      const AppClass = (await import(`../apps/${appKey}`)).default;
      const computedParameters = Processor.computeParameters(rawParameters, priorExecutionSteps);
      const appInstance = new AppClass(appData, connection.data, computedParameters);
      const commands = isTrigger ? appInstance.triggers : appInstance.actions;
      const command = commands[key];
      fetchedData = await command.run();

      previousExecutionStep = await execution
        .$relatedQuery('executionSteps')
        .insertAndFetch({
          stepId: id,
          status: 'success',
          dataIn: previousExecutionStep?.dataOut,
          dataOut: fetchedData,
        });

      priorExecutionSteps[id] = previousExecutionStep;

      if (id === this.untilStep.id) {
        return fetchedData;
      }
    }

    return fetchedData;
  }

  static computeParameters(parameters: Step["parameters"], executionSteps: ExecutionSteps): Step["parameters"] {
    const entries = Object.entries(parameters);
    return entries.reduce((result, [key, value]: [string, string]) => {
      const parts = value.split(Processor.variableRegExp);

      const computedValue = parts.map((part: string) => {
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
      }).join('');

      return {
        ...result,
        [key]: computedValue,
      }
    }, {});
  }
}

export default Processor;
