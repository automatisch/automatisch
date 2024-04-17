import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';
import { useQuery } from '@tanstack/react-query';

import api from 'helpers/api';

const variableRegExp = /({.*?})/;
// TODO: extract this function to a separate file
function computeArguments(args, getValues) {
  const initialValue = {};

  return args.reduce((result, { name, value }) => {
    const isVariable = variableRegExp.test(value);

    if (isVariable) {
      const sanitizedFieldPath = value.replace(/{|}/g, '');
      const computedValue = getValues(sanitizedFieldPath);

      if (computedValue === undefined || computedValue === '')
        throw new Error(`The ${sanitizedFieldPath} field is required.`);

      set(result, name, computedValue);
      return result;
    }

    set(result, name, value);
    return result;
  }, initialValue);
}

/**
 * Fetch the dynamic fields for the given step.
 * This hook must be within a react-hook-form context.
 *
 * @param stepId - the id of the step
 * @param schema - the field schema that needs the dynamic fields
 */
function useDynamicFields(stepId, schema) {
  const lastComputedVariables = React.useRef({});
  const { getValues } = useFormContext();
  const formValues = getValues();

  /**
   * Return `null` when even a field is missing value.
   *
   * This must return the same reference if no computed variable is changed.
   * Otherwise, it causes redundant network request!
   */
  const computedVariables = React.useMemo(() => {
    if (schema.type === 'dropdown' && schema.additionalFields) {
      try {
        const variables = computeArguments(
          schema.additionalFields.arguments,
          getValues,
        );
        // if computed variables are the same, return the last computed variables.
        if (isEqual(variables, lastComputedVariables.current)) {
          return lastComputedVariables.current;
        }
        lastComputedVariables.current = variables;
        return variables;
      } catch (err) {
        return null;
      }
    }

    return null;
    /**
     * `formValues` is to trigger recomputation when form is updated.
     * `getValues` is for convenience as it supports paths for fields like `getValues('foo.bar.baz')`.
     */
  }, [schema, formValues, getValues]);

  const query = useQuery({
    queryKey: ['steps', stepId, 'dynamicFields', computedVariables],
    queryFn: async ({ signal }) => {
      const { data } = await api.post(
        `/v1/steps/${stepId}/dynamic-fields`,
        {
          dynamicFieldsKey: computedVariables.key,
          parameters: computedVariables.parameters,
        },
        { signal },
      );

      return data;
    },
    enabled: !!stepId && !!computedVariables,
  });

  return query;
}

export default useDynamicFields;
