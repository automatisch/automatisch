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

      const arrayItems = sampleValue.flatMap((item, index) => {
        const itemItself = {
          label: `${label}.${index}`,
          value: `${value}.${index}`,
          sampleValue: JSON.stringify(item),
        };

        const itemEntries = process({
          data: item,
          parentKey: value,
          index,
          parentLabel: label,
        });

        return [itemItself].concat(itemEntries);
      });

      return [arrayItself].concat(arrayItems);
    }

    if (typeof sampleValue === 'object' && sampleValue !== null) {
      const objectItself = {
        label,
        value,
        sampleValue: JSON.stringify(sampleValue),
      };

      const objectEntries = process({
        data: sampleValue,
        parentKey: value,
        parentLabel: label,
      });

      return [objectItself].concat(objectEntries);
    }

    return [
      {
        label,
        value,
        sampleValue:
          typeof sampleValue === 'string'
            ? sampleValue
            : JSON.stringify(sampleValue),
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
      name: `${index + 1}. ${step.name}`,
      output: process({
        data: step.executionSteps?.[0]?.dataOut || {},
        parentKey: `step.${step.id}`,
      }),
    }));
};
