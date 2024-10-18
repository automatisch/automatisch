import React, { useEffect, useRef } from 'react';
import { useFormContext } from 'react-hook-form';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import ControlledCheckbox from 'components/ControlledCheckbox';

const ActionField = ({ action, subject, disabled, name, syncIsCreator }) => {
  const { watch, formState, resetField } = useFormContext();

  const actionFieldName = `${name}.${subject.key}.${action.key}.value`;
  const actionFieldValue = watch(actionFieldName);

  const conditionFieldName = `${name}.${subject.key}.${action.key}.conditions.isCreator`;
  const conditionFieldTouched =
    formState.touchedFields?.[name]?.[subject.key]?.[action.key]?.conditions
      ?.isCreator === true;

  const defaultActionFieldValueRef = useRef(actionFieldValue);

  useEffect(() => {
    if (defaultActionFieldValueRef?.current === undefined) {
      defaultActionFieldValueRef.current = actionFieldValue;
    } else if (
      syncIsCreator &&
      defaultActionFieldValueRef?.current === false &&
      !conditionFieldTouched
    ) {
      resetField(conditionFieldName, { defaultValue: actionFieldValue });
    }
  }, [actionFieldValue, syncIsCreator]);

  return (
    <Typography variant="subtitle2" component="div">
      {action.subjects.includes(subject.key) && (
        <ControlledCheckbox
          disabled={disabled}
          name={`${name}.${subject.key}.${action.key}.value`}
          dataTest={`${action.key.toLowerCase()}-checkbox`}
        />
      )}

      {!action.subjects.includes(subject.key) && '-'}
    </Typography>
  );
};

ActionField.propTypes = {
  action: PropTypes.shape({
    key: PropTypes.string.isRequired,
    subjects: PropTypes.arrayOf(PropTypes.string).isRequired,
  }),
  subject: PropTypes.shape({
    key: PropTypes.string.isRequired,
  }).isRequired,
  disabled: PropTypes.bool,
  name: PropTypes.string.isRequired,
  syncIsCreator: PropTypes.bool,
};

export default ActionField;
