import template from 'lodash/template';
import type { IAuthenticationStepField, IJSONObject } from '@automatisch/types';

const interpolate = /{([\s\S]+?)}/g;

type Variables = {
  [key: string]: any;
};

type IVariable = Omit<IAuthenticationStepField, 'properties'> &
  Partial<Pick<IAuthenticationStepField, 'properties'>>;

const computeAuthStepVariables = (
  variableSchema: IVariable[],
  aggregatedData: IJSONObject
): IJSONObject => {
  const variables: Variables = {};

  for (const variable of variableSchema) {
    if (variable.properties) {
      variables[variable.name] = computeAuthStepVariables(
        variable.properties,
        aggregatedData
      );

      continue;
    }

    if (variable.value) {
      if (variable.value.endsWith('.all}')) {
        const key = variable.value.replace('{', '').replace('.all}', '');
        variables[variable.name] = aggregatedData[key];

        continue;
      }

      const computedVariable = template(variable.value, { interpolate })(
        aggregatedData
      );

      variables[variable.name] = computedVariable;
    }
  }

  return variables;
};

export default computeAuthStepVariables;
