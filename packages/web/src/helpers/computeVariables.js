import template from 'lodash/template';
const interpolate = /{([\s\S]+?)}/g;
const computeAuthStepVariables = (variableSchema, aggregatedData) => {
  const variables = {};
  for (const variable of variableSchema) {
    if (variable.properties) {
      variables[variable.name] = computeAuthStepVariables(
        variable.properties,
        aggregatedData
      );
      continue;
    }
    if (variable.value) {
      const computedVariable = template(variable.value, { interpolate })(
        aggregatedData
      );
      variables[variable.name] = computedVariable;
    }
  }
  return variables;
};
export default computeAuthStepVariables;
