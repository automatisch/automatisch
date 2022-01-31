import * as React from 'react';
import { FormProvider, useForm, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';
import type { UseFormProps } from 'react-hook-form';

type FormProps = {
  children: React.ReactNode;
  defaultValues?: UseFormProps['defaultValues'];
  onSubmit?: SubmitHandler<FieldValues>;
}

const noop = () => null;

export default function Form(props: FormProps): React.ReactElement {
  const { children, onSubmit = noop, defaultValues, ...formProps } = props;
  const methods: UseFormReturn = useForm({
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} {...formProps}>
        {children}
      </form>
    </FormProvider>
  );
};
