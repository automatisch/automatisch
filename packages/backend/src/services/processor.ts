import App from '../models/app';
import Flow from '../models/flow';
import Step from '../models/step';
import Execution from '../models/execution';
import ExecutionStep from '../models/execution-step';

class Processor {
  flow: Flow;
  untilStep: Step;

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

    for await (const step of steps) {
      const appData = App.findOneByKey(step.appKey);

      if (step.type.toString() === 'trigger') {
        const appClass = (await import(`../apps/${step.appKey}`)).default;
        const appInstance = new appClass(appData, step.connection.data);
        fetchedData = await appInstance.triggers[step.key].run();

        previousExecutionStep = await execution
          .$relatedQuery('executionSteps')
          .insertAndFetch({
            stepId: step.id,
            status: 'success',
            dataOut: fetchedData,
          });
      } else {
        const appClass = (await import(`../apps/${step.appKey}`)).default;
        const appInstance = new appClass(
          appData,
          step.connection.data,
          step.parameters
        );
        fetchedData = await appInstance.actions[step.key].run();

        previousExecutionStep = await execution
          .$relatedQuery('executionSteps')
          .insertAndFetch({
            stepId: step.id,
            status: 'success',
            dataIn: previousExecutionStep.dataOut,
            dataOut: fetchedData,
          });
      }

      if (step.id === this.untilStep.id) {
        return fetchedData;
      }
    }

    return fetchedData;
  }
}

export default Processor;
