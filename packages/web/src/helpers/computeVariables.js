const interpolate = /{([\s\S]+?)}/g;

const computeVariables = (variableSchema, aggregatedData) => {
  const variables = {};

  for (const variable of variableSchema) {
    if (variable.properties) {
      variables[variable.name] = computeVariables(
        variable.properties,
        aggregatedData
      );
      continue;
    }
    if (variable.value && interpolate.test(variable.value)) {
      variables[variable.name] = variable.value.replace(interpolate, (_, key) => aggregatedData[key] || "");
    } else {
      variables[variable.name] = variable.value || "";
    }
  }

  return variables;
};

export default computeVariables;
