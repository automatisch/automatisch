import PropTypes from 'prop-types';
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

Controller.propTypes = {
  defaultValue: PropTypes.string,
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  shouldUnregister: PropTypes.bool,
  children: PropTypes.element.isRequired,
};

export default Controller;
