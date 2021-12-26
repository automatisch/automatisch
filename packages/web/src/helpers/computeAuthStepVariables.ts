import template from 'lodash.template';

const interpolate = /{([\s\S]+?)}/g;

type VARIABLES = {
  [key: string]: any
}

const computeAuthStepVariables = (variableSchema: any, aggregatedData: any) => {
  const variables: VARIABLES = {};

  for (const variable of variableSchema) {
    if (variable.properties) {
      variables[variable.name] = computeAuthStepVariables(variable.properties, aggregatedData);

      continue;
    }

    const computedVariable = template(variable.value, { interpolate })(aggregatedData);

    if (variable.type === 'integer') {
      variables[variable.name] = parseInt(computedVariable, 10);
    } else {
      variables[variable.name] = computedVariable;
    }
  }

  return variables;
};

export default computeAuthStepVariables;
