import * as React from 'react';
import { FormProvider, useForm, FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

type FormProps = {
  children: React.ReactNode;
  onSubmit: SubmitHandler<FieldValues>;
}

export default function Form(props: FormProps): React.ReactElement {
  const { children, onSubmit, ...formProps } = props;
  const methods: UseFormReturn = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} {...formProps}>
        {children}
      </form>
    </FormProvider>
  );
};
