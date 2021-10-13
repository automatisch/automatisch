import React from 'react';
import { FieldValues, FormProvider, SubmitHandler, useForm, UseFormReturn } from "react-hook-form";

type FormProps = {
  children: React.ReactNode;
  onSubmit: SubmitHandler<FieldValues>;
}

export default function Form(props: FormProps) {
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
