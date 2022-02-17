import { Step } from 'types/step';

const joinBy = (delimiter = '.', ...args: string[]) => args.filter(Boolean).join(delimiter);

const process = (data: any, parentKey?: any, index?: number): any[] => {
  if (typeof data !== 'object') {
    return [
      {
        name: `${parentKey}.${index}`,
        value: data,
      }
    ]
  }

  const entries = Object.entries(data);

  return entries.flatMap(([name, value]) => {
    const fullName = joinBy('.', parentKey, (index as number)?.toString(), name);

    if (Array.isArray(value)) {
      return value.flatMap((item, index) => process(item, fullName, index));
    }

    if (typeof value === 'object' && value !== null) {
      return process(value, fullName);
    }

    return [{
      name: fullName,
      value,
    }];
  });
};

export const processStepWithExecutions = (steps: Step[]): any[] => {
  if (!steps) return [];

  return steps.map((step: Step, index: number) => ({
    id: step.id,
    // TODO: replace with step.name once introduced
    name: `${index + 1}. ${step.appKey}`,
    output: process(step.output, `step.${step.id}`),
  }));
};
