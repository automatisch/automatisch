import * as React from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

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

  const methods = useForm({
    defaultValues,
    reValidateMode,
    resolver,
    mode,
  });

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

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit((data, event) =>
          onSubmit?.(data, event, methods.setError),
        )}
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
