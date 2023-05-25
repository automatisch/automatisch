import * as React from 'react';
import { Controller as RHFController, useFormContext } from 'react-hook-form';

interface ControllerProps {
  defaultValue?: string;
  name: string;
  required?: boolean;
  shouldUnregister?: boolean;
  children: React.ReactElement;
}

function Controller(
  props: ControllerProps
): React.ReactElement {
  const { control } = useFormContext();
  const {
    defaultValue = '',
    name,
    required,
    shouldUnregister,
    children,
  } = props;

  return (
    <RHFController
      rules={{ required }}
      name={name}
      control={control}
      defaultValue={defaultValue}
      shouldUnregister={shouldUnregister ?? false}
      render={({
        field,
      }) => React.cloneElement(children, { field })}
    />
  );
}

export default Controller;
