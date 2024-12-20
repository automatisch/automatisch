import React from 'react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import ControlledCheckbox from 'components/ControlledCheckbox';

const ActionField = ({ action, subject, disabled, name, syncIsCreator }) => {
  const { formState, resetField } = useFormContext();

  const actionDefaultValue =
    formState.defaultValues?.[name]?.[subject.key]?.[action.key].value;
  const conditionFieldName = `${name}.${subject.key}.${action.key}.conditions.isCreator`;
  const conditionFieldTouched =
    formState.touchedFields?.[name]?.[subject.key]?.[action.key]?.conditions
      ?.isCreator === true;

  const handleSyncIsCreator = (newValue) => {
    if (
      syncIsCreator &&
      actionDefaultValue === false &&
      !conditionFieldTouched
    ) {
      resetField(conditionFieldName, { defaultValue: newValue });
    }
  };

  return (
    <ControlledCheckbox
      disabled={disabled}
      name={`${name}.${subject.key}.${action.key}.value`}
      dataTest={`${action.key.toLowerCase()}-checkbox`}
      onChange={(e, value) => {
        handleSyncIsCreator(value);
      }}
    />
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
