import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import set from 'lodash/set';
import first from 'lodash/first';
import last from 'lodash/last';
import { useMutation } from '@tanstack/react-query';
import isEqual from 'lodash/isEqual';

import api from 'helpers/api';
import useFieldEntryContext from './useFieldEntryContext';

const variableRegExp = /({.*?})/;

function computeArguments(args, getValues, fieldEntryPaths) {
  const initialValue = {};

  return args.reduce((result, { name, value }) => {
    const isVariable = variableRegExp.test(value);

    if (isVariable) {
      const fieldsEntryPath = last(fieldEntryPaths);
      const outerFieldsEntryPath = first(fieldEntryPaths);

      const sanitizedFieldPath = value
        .replace(/{|}/g, '')
        .replace('fieldsScope.', `${fieldsEntryPath}.`)
        .replace('outerScope.', `${outerFieldsEntryPath}.`);

      const computedValue = getValues(sanitizedFieldPath);

      if (computedValue === undefined)
        throw new Error(`The ${sanitizedFieldPath} field is required.`);

      set(result, name, computedValue);

      return result;
    }

    set(result, name, value);
    return result;
  }, initialValue);
}
/**
 * Fetch the dynamic data for the given step.
 * This hook must be within a react-hook-form context.
 *
 * @param stepId - the id of the step
 * @param schema - the field that needs the dynamic data
 */
function useDynamicData(stepId, schema) {
  const lastComputedVariables = React.useRef({});

  const {
    data,
    isPending: isDynamicDataPending,
    mutate: getDynamicData,
  } = useMutation({
    mutationFn: async (variables) => {
      const { data } = await api.post(
        `/v1/steps/${stepId}/dynamic-data`,
        variables,
      );

      return data;
    },
  });

  const { getValues } = useFormContext();
  const { fieldEntryPaths } = useFieldEntryContext();
  const formValues = getValues();

  /**
   * Return `null` when even a field is missing value.
   *
   * This must return the same reference if no computed variable is changed.
   * Otherwise, it causes redundant network request!
   */
  const computedVariables = React.useMemo(() => {
    if (schema.type === 'dropdown' && schema.source) {
      try {
        const variables = computeArguments(
          schema.source.arguments,
          getValues,
          fieldEntryPaths,
        );

        // if computed variables are the same, return the last computed variables.
        if (isEqual(variables, lastComputedVariables.current)) {
          return lastComputedVariables.current;
        }

        lastComputedVariables.current = variables;

        return variables;
      } catch {
        return null;
      }
    }

    return null;
    /**
     * `formValues` is to trigger recomputation when form is updated.
     * `getValues` is for convenience as it supports paths for fields like `getValues('foo.bar.baz')`.
     */
  }, [schema, formValues, getValues, fieldEntryPaths]);

  React.useEffect(() => {
    if (
      schema.type === 'dropdown' &&
      stepId &&
      schema.source &&
      computedVariables
    ) {
      const { key, parameters } = computedVariables;

      getDynamicData({
        dynamicDataKey: key,
        parameters,
      });
    }
  }, [getDynamicData, stepId, schema, computedVariables]);

  return {
    data: data?.data,
    loading: isDynamicDataPending,
  };
}
export default useDynamicData;
