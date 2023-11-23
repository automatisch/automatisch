import { useFieldArray, useFormContext } from 'react-hook-form';
import FormControlLabel from '@mui/material/FormControlLabel';
import Divider from '@mui/material/Divider';
import Checkbox from '@mui/material/Checkbox';

import useFormatMessage from 'hooks/useFormatMessage';
import ControlledCheckbox from 'components/ControlledCheckbox';
import { Stack } from '@mui/material';

type Roles = { id: string; name: string; checked: boolean }[];

function RolesFieldArray() {
  const formatMessage = useFormatMessage();
  const { control, watch, setValue } = useFormContext();
  const fieldArrayData = useFieldArray({
    control,
    name: 'roles',
  });

  const fields = fieldArrayData.fields as Roles;
  const watchedFields = watch('roles') as Roles;
  const allFieldsSelected = watchedFields.every((field) => field.checked);
  const allFieldsDeselected = watchedFields.every((field) => !field.checked);

  const handleSelectAllClick = () => {
    setValue(
      'roles',
      watchedFields.map((field) => ({ ...field, checked: !allFieldsSelected })),
      { shouldDirty: true }
    );
  };

  return (
    <Stack direction="column" spacing={1}>
      <FormControlLabel
        control={
          <Checkbox
            color="primary"
            indeterminate={!(allFieldsSelected || allFieldsDeselected)}
            checked={allFieldsSelected}
            onChange={handleSelectAllClick}
          />
        }
        label={
          allFieldsSelected
            ? formatMessage('adminAppsConnections.deselectAll')
            : formatMessage('adminAppsConnections.selectAll')
        }
        sx={{ margin: 0 }}
      />
      <Divider />
      {fields.map((role, index) => {
        return (
          <FormControlLabel
            key={role.id}
            control={
              <ControlledCheckbox
                name={`roles.${index}.checked`}
                defaultValue={role.checked}
              />
            }
            label={role.name}
          />
        );
      })}
    </Stack>
  );
}

export default RolesFieldArray;
