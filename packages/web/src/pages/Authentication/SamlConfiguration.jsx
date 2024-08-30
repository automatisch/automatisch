import PropTypes from 'prop-types';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import * as React from 'react';

import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import Form from 'components/Form';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminCreateSamlAuthProvider from 'hooks/useAdminCreateSamlAuthProvider';
import useAdminUpdateSamlAuthProvider from 'hooks/useAdminUpdateSamlAuthProvider';
import useRoles from 'hooks/useRoles.ee';

const defaultValues = {
  active: false,
  name: '',
  certificate: '',
  signatureAlgorithm: 'sha1',
  issuer: '',
  entryPoint: '',
  firstnameAttributeName: '',
  surnameAttributeName: '',
  emailAttributeName: '',
  roleAttributeName: '',
  defaultRoleId: '',
};

function generateRoleOptions(roles) {
  return roles?.map(({ name: label, id: value }) => ({ label, value }));
}

function SamlConfiguration({ provider, providerLoading }) {
  const formatMessage = useFormatMessage();
  const { data, loading: isRolesLoading } = useRoles();
  const roles = data?.data;
  const enqueueSnackbar = useEnqueueSnackbar();

  const {
    mutateAsync: createSamlAuthProvider,
    isPending: isCreateSamlAuthProviderPending,
  } = useAdminCreateSamlAuthProvider();

  const {
    mutateAsync: updateSamlAuthProvider,
    isPending: isUpdateSamlAuthProviderPending,
  } = useAdminUpdateSamlAuthProvider(provider?.id);

  const isPending =
    isCreateSamlAuthProviderPending || isUpdateSamlAuthProviderPending;

  const handleSubmit = async (providerData) => {
    try {
      if (provider?.id) {
        await updateSamlAuthProvider(providerData);
      } else {
        await createSamlAuthProvider(providerData);
      }

      enqueueSnackbar(formatMessage('authenticationForm.successfullySaved'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-save-saml-provider-success',
        },
      });
    } catch (error) {
      throw new Error('Failed while saving!');
    }
  };

  if (providerLoading) {
    return null;
  }

  return (
    <Form defaultValues={provider || defaultValues} onSubmit={handleSubmit}>
      <Stack direction="column" gap={2}>
        <Switch
          name="active"
          label={formatMessage('authenticationForm.active')}
        />
        <TextField
          required={true}
          name="name"
          label={formatMessage('authenticationForm.name')}
          fullWidth
        />
        <TextField
          required={true}
          name="certificate"
          label={formatMessage('authenticationForm.certificate')}
          fullWidth
          multiline
        />
        <ControlledAutocomplete
          name="signatureAlgorithm"
          fullWidth
          disablePortal
          disableClearable={true}
          options={[
            { label: 'SHA1', value: 'sha1' },
            { label: 'SHA256', value: 'sha256' },
            { label: 'SHA512', value: 'sha512' },
          ]}
          renderInput={(params) => (
            <MuiTextField
              {...params}
              label={formatMessage('authenticationForm.signatureAlgorithm')}
            />
          )}
        />
        <TextField
          required={true}
          name="issuer"
          label={formatMessage('authenticationForm.issuer')}
          fullWidth
        />
        <TextField
          required={true}
          name="entryPoint"
          label={formatMessage('authenticationForm.entryPoint')}
          fullWidth
        />
        <TextField
          required={true}
          name="firstnameAttributeName"
          label={formatMessage('authenticationForm.firstnameAttributeName')}
          fullWidth
        />
        <TextField
          required={true}
          name="surnameAttributeName"
          label={formatMessage('authenticationForm.surnameAttributeName')}
          fullWidth
        />
        <TextField
          required={true}
          name="emailAttributeName"
          label={formatMessage('authenticationForm.emailAttributeName')}
          fullWidth
        />
        <TextField
          required={true}
          name="roleAttributeName"
          label={formatMessage('authenticationForm.roleAttributeName')}
          fullWidth
        />
        <ControlledAutocomplete
          name="defaultRoleId"
          fullWidth
          disablePortal
          disableClearable={true}
          options={generateRoleOptions(roles)}
          renderInput={(params) => (
            <MuiTextField
              {...params}
              label={formatMessage('authenticationForm.defaultRole')}
            />
          )}
          loading={isRolesLoading}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          sx={{ boxShadow: 2 }}
          loading={isPending}
        >
          {formatMessage('authenticationForm.save')}
        </LoadingButton>
      </Stack>
    </Form>
  );
}

SamlConfiguration.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    certificate: PropTypes.string,
    signatureAlgorithm: PropTypes.oneOf(['sha1', 'sha256', 'sha512']),
    issuer: PropTypes.string,
    entryPoint: PropTypes.string,
    firstnameAttributeName: PropTypes.string,
    surnameAttributeName: PropTypes.string,
    emailAttributeName: PropTypes.string,
    roleAttributeName: PropTypes.string,
    defaultRoleId: PropTypes.string,
  }),
  providerLoading: PropTypes.bool,
};

export default SamlConfiguration;
