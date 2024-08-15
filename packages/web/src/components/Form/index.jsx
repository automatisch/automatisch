import * as React from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import PropTypes from 'prop-types';

const noop = () => null;

function Form(props) {
  const {
    children,
    onSubmit = noop,
    defaultValues,
    resolver,
    render,
    mode = 'all',
    ...formProps
  } = props;

  const methods = useForm({
    defaultValues,
    reValidateMode: 'onBlur',
    resolver,
    mode,
  });

  const form = useWatch({ control: methods.control });

  /**
   * For fields having `dependsOn` fields, we need to re-validate the form.
   */
  React.useEffect(() => {
    methods.trigger();
  }, [methods.trigger, form]);

  React.useEffect(() => {
    methods.reset(defaultValues);
  }, [defaultValues]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} {...formProps}>
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
};

export default Form;
