import get from 'lodash.get';
import { IActionOutput } from '@automatisch/types';

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

  static computeParameters(
    parameters: Step['parameters'],
    executionSteps: ExecutionStep[]
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
              const executionStep = executionSteps.find((executionStep) => {
                return executionStep.stepId === stepId;
              });
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
