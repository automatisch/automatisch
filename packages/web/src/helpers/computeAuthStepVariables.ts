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

    variables[variable.name] = template(variable.value, { interpolate })(aggregatedData);
  }

  return variables;
};

export default computeAuthStepVariables;
