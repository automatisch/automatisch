import template from 'lodash.template';

const interpolate = /{([\s\S]+?)}/g;

type VARIABLES = {
  [key: string]: any
}

const computeAuthStepVariables = (authStep: any, aggregatedData: any) => {
  const variables: VARIABLES = {};

  for (const field of authStep.fields) {
    if (field.fields) {
      variables[field.name] = computeAuthStepVariables(field, aggregatedData);

      continue;
    }

    variables[field.name] = template(field.value, { interpolate })(aggregatedData);
  }

  return variables;
};

export default computeAuthStepVariables;
