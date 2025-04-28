import * as React from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';
import useFormatMessage from 'hooks/useFormatMessage';

const noop = () => null;

function Form(props) {
  const {
    children,
    onSubmit = noop,
    defaultValues,
    resolver,
    render,
    mode = 'all',
    reValidateMode = 'onBlur',
    automaticValidation = true,
    ...formProps
  } = props;

  const formatMessage = useFormatMessage();

  const methods = useForm({
    defaultValues,
    reValidateMode,
    resolver,
    mode,
  });

  const { setError } = methods;

  const form = useWatch({ control: methods.control });
  const prevDefaultValues = React.useRef(defaultValues);

  /**
   * For fields having `dependsOn` fields, we need to re-validate the form.
   */
  React.useEffect(() => {
    if (automaticValidation) {
      methods.trigger();
    }
  }, [methods.trigger, form]);

  React.useEffect(() => {
    if (!isEqual(defaultValues, prevDefaultValues.current)) {
      prevDefaultValues.current = defaultValues;
      methods.reset(defaultValues);
    }
  }, [defaultValues]);

  const handleErrors = React.useCallback(
    function (errors) {
      if (!errors) return;

      let shouldSetGenericGeneralError = true;
      const fieldNames = Object.keys(defaultValues);

      Object.entries(errors).forEach(([fieldName, fieldErrors]) => {
        if (fieldNames.includes(fieldName) && Array.isArray(fieldErrors)) {
          shouldSetGenericGeneralError = false;
          setError(fieldName, {
            type: 'fieldRequestError',
            message: fieldErrors.join(', '),
          });
        }
      });

      // in case of general errors
      if (Array.isArray(errors.general)) {
        for (const error of errors.general) {
          shouldSetGenericGeneralError = false;
          setError('root.general', { type: 'requestError', message: error });
        }
      }

      if (shouldSetGenericGeneralError) {
        setError('root.general', {
          type: 'requestError',
          message: formatMessage('form.genericError'),
        });
      }
    },
    [defaultValues, formatMessage, setError],
  );

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(async (data) => {
          try {
            return await onSubmit?.(data);
          } catch (errors) {
            handleErrors(errors);
          }
        })}
        {...formProps}
      >
        {render ? render(methods) : children}
      </form>
    </FormProvider>
  );
}

Form.propTypes = {
  children: PropTypes.node,
  defaultValues: PropTypes.object,
  onSubmit: PropTypes.func,
  render: PropTypes.func,
  resolver: PropTypes.func,
  mode: PropTypes.oneOf(['onChange', 'onBlur', 'onSubmit', 'onTouched', 'all']),
  reValidateMode: PropTypes.oneOf(['onChange', 'onBlur', 'onSubmit']),
  automaticValidation: PropTypes.bool,
};

export default Form;
