import * as React from 'react';
import {
  FormProvider,
  useForm,
  useWatch,
  FieldValues,
  SubmitHandler,
  UseFormReturn,
} from 'react-hook-form';
import type { UseFormProps } from 'react-hook-form';

type FormProps = {
  children?: React.ReactNode;
  defaultValues?: UseFormProps['defaultValues'];
  onSubmit?: SubmitHandler<FieldValues>;
  render?: (props: UseFormReturn) => React.ReactNode;
  resolver?: UseFormProps['resolver'];
  mode?: UseFormProps['mode'];
};

const noop = () => null;

export default function Form(props: FormProps): React.ReactElement {
  const {
    children,
    onSubmit = noop,
    defaultValues,
    resolver,
    render,
    mode = 'all',
    ...formProps
  } = props;

  const methods: UseFormReturn = useForm({
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
