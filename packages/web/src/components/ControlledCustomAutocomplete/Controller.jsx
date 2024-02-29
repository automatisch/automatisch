import * as React from 'react';
import { Controller as RHFController, useFormContext } from 'react-hook-form';
function Controller(props) {
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
      render={({ field }) => React.cloneElement(children, { field })}
    />
  );
}
export default Controller;
