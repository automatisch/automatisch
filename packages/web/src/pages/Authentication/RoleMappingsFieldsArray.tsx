import { useFieldArray, useFormContext } from 'react-hook-form';
import { IRole } from '@automatisch/types';
import MuiTextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

import useRoles from 'hooks/useRoles.ee';
import useFormatMessage from 'hooks/useFormatMessage';

import ControlledAutocomplete from 'components/ControlledAutocomplete';
import TextField from 'components/TextField';
import { Divider, Typography } from '@mui/material';

function generateRoleOptions(roles: IRole[]) {
  return roles?.map(({ name: label, id: value }) => ({ label, value }));
}

function RoleMappingsFieldArray() {
  const formatMessage = useFormatMessage();
  const { control } = useFormContext();
  const { roles, loading: rolesLoading } = useRoles();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'roleMappings',
  });

  const handleAppendMapping = () => append({ roleId: '', remoteRoleName: '' });
  const handleRemoveMapping = (index: number) => () => remove(index);
  return (
    <>
      {fields.length === 0 && (
        <Typography>{formatMessage('roleMappingsForm.notFound')}</Typography>
      )}
      {fields.map((field, index) => (
        <div key={field.id}>
          <Stack
            direction="row"
            spacing={2}
            alignItems="flex-start"
            pb={1.5}
            pt={0.5}
          >
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems="stretch"
              sx={{ flex: 1 }}
            >
              <TextField
                name={`roleMappings.${index}.remoteRoleName`}
                label={formatMessage('roleMappingsForm.remoteRoleName')}
                fullWidth
                required
              />
              <ControlledAutocomplete
                name={`roleMappings.${index}.roleId`}
                fullWidth
                disablePortal
                disableClearable
                options={generateRoleOptions(roles)}
                renderInput={(params) => (
                  <MuiTextField
                    {...params}
                    label={formatMessage('roleMappingsForm.role')}
                  />
                )}
                loading={rolesLoading}
                required
              />
            </Stack>
            <IconButton
              aria-label="delete"
              color="primary"
              size="large"
              sx={{ alignSelf: 'flex-start' }}
              onClick={handleRemoveMapping(index)}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
          {index < fields.length - 1 && <Divider />}
        </div>
      ))}
      <Button fullWidth onClick={handleAppendMapping}>
        {formatMessage('roleMappingsForm.appendRoleMapping')}
      </Button>
    </>
  );
}

export default RoleMappingsFieldArray;
