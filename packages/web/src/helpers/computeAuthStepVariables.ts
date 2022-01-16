import template from 'lodash.template';

const interpolate = /{([\s\S]+?)}/g;

type Variables = {
  [key: string]: any
}

type VariableSchema = {
  properties: VariableSchema[];
  name: string;
  type: 'string' | 'integer';
  value: string;
}

type AggregatedData = {
  [key: string]: Record<string, unknown> | string;
}

const computeAuthStepVariables = (variableSchema: VariableSchema[], aggregatedData: AggregatedData): Variables => {
  const variables: Variables = {};

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
