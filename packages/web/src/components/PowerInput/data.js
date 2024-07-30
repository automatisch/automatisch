const joinBy = (delimiter = '.', ...args) =>
  args.filter(Boolean).join(delimiter);

const process = ({ data, parentKey, index, parentLabel = '' }) => {
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
    const label = joinBy('.', parentLabel, index?.toString(), name);
    const value = joinBy('.', parentKey, index?.toString(), name);

    if (Array.isArray(sampleValue)) {
      const arrayItself = {
        label,
        value,
        sampleValue: JSON.stringify(sampleValue),
      };

      const arrayItems =  sampleValue.flatMap((item, index) =>
        process({
          data: item,
          parentKey: value,
          index,
          parentLabel: label,
        }),
      );

      // TODO: remove spreading
      return [arrayItself, ...arrayItems];
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

export const processStepWithExecutions = (steps) => {
  if (!steps) return [];

  return steps
    .filter((step) => {
      const hasExecutionSteps = !!step.executionSteps?.length;
      return hasExecutionSteps;
    })
    .map((step, index) => ({
      id: step.id,
      // TODO: replace with step.name once introduced
      name: `${index + 1}. ${
        (step.appKey || '').charAt(0)?.toUpperCase() + step.appKey?.slice(1)
      }`,
      output: process({
        data: step.executionSteps?.[0]?.dataOut || {},
        parentKey: `step.${step.id}`,
      }),
    }));
};
