import Step from '../models/step';
import ExecutionStep from '../models/execution-step';
import get from 'lodash.get';

// INFO: don't remove space in allowed character group!
const variableRegExp = /({{step\.[\da-zA-Z-]+(?:\.[\da-zA-Z-_ ]+)+}})/g;

export default function computeParameters(
  parameters: Step['parameters'],
  executionSteps: ExecutionStep[]
): Step['parameters'] {
  const entries = Object.entries(parameters);
  return entries.reduce((result, [key, value]: [string, unknown]) => {
    if (typeof value === 'string') {
      const parts = value.split(variableRegExp);

      const computedValue = parts
        .map((part: string) => {
          const isVariable = part.match(variableRegExp);
          if (isVariable) {
            const stepIdAndKeyPath = part.replace(/{{step.|}}/g, '') as string;
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

    if (Array.isArray(value)) {
      return {
        ...result,
        [key]: value.map(item => computeParameters(item, executionSteps)),
      };
    }

    return {
      ...result,
      [key]: value,
    };
  }, {});
}
