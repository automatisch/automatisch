import * as React from 'react';
import { useLazyQuery } from '@apollo/client';
import type { UseFormReturn } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';
import set from 'lodash/set';
import isEqual from 'lodash/isEqual';
import type {
  IField,
  IFieldDropdownAdditionalFields,
  IJSONObject,
} from '@automatisch/types';

import { GET_DYNAMIC_FIELDS } from 'graphql/queries/get-dynamic-fields';

const variableRegExp = /({.*?})/;

// TODO: extract this function to a separate file
function computeArguments(
  args: IFieldDropdownAdditionalFields['arguments'],
  getValues: UseFormReturn['getValues']
): IJSONObject {
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
function useDynamicFields(stepId: string | undefined, schema: IField) {
  const lastComputedVariables = React.useRef({});
  const [getDynamicFields, { called, data, loading }] =
    useLazyQuery(GET_DYNAMIC_FIELDS);
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
          getValues
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

  React.useEffect(() => {
    if (
      schema.type === 'dropdown' &&
      stepId &&
      schema.additionalFields &&
      computedVariables
    ) {
      getDynamicFields({
        variables: {
          stepId,
          ...computedVariables,
        },
      });
    }
  }, [getDynamicFields, stepId, schema, computedVariables]);

  return {
    called,
    data: data?.getDynamicFields as IField[] | undefined,
    loading,
  };
}

export default useDynamicFields;
