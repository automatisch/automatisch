import type { IStep } from '@automatisch/types';

const joinBy = (delimiter = '.', ...args: string[]) =>
  args.filter(Boolean).join(delimiter);

type TProcessPayload = {
  data: any;
  parentKey: string;
  index?: number;
  parentLabel?: string;
};

const process = ({ data, parentKey, index, parentLabel = '' }: TProcessPayload): any[] => {
  if (typeof data !== 'object') {
    return [
      {
        label: `${parentLabel}.${index}`,
        value: `${parentKey}.${index}`,
        sampleValue: data,
      },
    ];
  }

  const entries = Object.entries(data);

  return entries.flatMap(([name, sampleValue]) => {
    const label = joinBy(
      '.',
      parentLabel,
      (index as number)?.toString(),
      name
    );

    const value = joinBy(
      '.',
      parentKey,
      (index as number)?.toString(),
      name
    );

    if (Array.isArray(sampleValue)) {
      return sampleValue.flatMap((item, index) => process({
        data: item,
        parentKey: value,
        index,
        parentLabel: label
      }));
    }

    if (typeof sampleValue === 'object' && sampleValue !== null) {
      return process({
        data: sampleValue,
        parentKey: value,
        parentLabel: label,
      });
    }

    return [
      {
        label,
        value,
        sampleValue,
      },
    ];
  });
};

export const processStepWithExecutions = (steps: IStep[]): any[] => {
  if (!steps) return [];

  return steps
    .filter((step: IStep) => {
      const hasExecutionSteps = !!step.executionSteps?.length;

      return hasExecutionSteps;
    })
    .map((step: IStep, index: number) => ({
      id: step.id,
      // TODO: replace with step.name once introduced
      name: `${index + 1}. ${(step.appKey || '').charAt(0)?.toUpperCase() + step.appKey?.slice(1)
        }`,
      output: process({
        data: step.executionSteps?.[0]?.dataOut || {},
        parentKey: `step.${step.id}`,
      }),
    }));
};
