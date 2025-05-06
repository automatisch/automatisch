import React from 'react';
import { useFormContext } from 'react-hook-form';
import PropTypes from 'prop-types';
import ControlledCheckbox from 'components/ControlledCheckbox';

const AllEntitiesPermissions = ({ action, subject, disabled, name }) => {
  const { getValues, resetField } = useFormContext();

  const fieldName = `${name}.${subject.key}.${action.key}.allEntities`;
  const ownEntitiesFieldName = `${name}.${subject.key}.${action.key}.ownEntities`;

  const currentValue = getValues(fieldName);

  React.useEffect(() => {
    if (currentValue === true) {
      resetField(ownEntitiesFieldName, { defaultValue: true });
    }
  }, [ownEntitiesFieldName, currentValue]);

  return (
    <ControlledCheckbox
      disabled={disabled}
      name={fieldName}
      dataTest={`${action.key.toLowerCase()}-checkbox`}
    />
  );
};

AllEntitiesPermissions.propTypes = {
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

export default AllEntitiesPermissions;
