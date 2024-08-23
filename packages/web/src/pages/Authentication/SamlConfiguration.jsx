import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import * as React from 'react';

import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import ControlledAutocomplete from 'components/ControlledAutocomplete';
import Form from 'components/Form';
import Switch from 'components/Switch';
import TextField from 'components/TextField';
import { UPSERT_SAML_AUTH_PROVIDER } from 'graphql/mutations/upsert-saml-auth-provider';
import useFormatMessage from 'hooks/useFormatMessage';
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

  const [upsertSamlAuthProvider, { loading }] = useMutation(
    UPSERT_SAML_AUTH_PROVIDER,
  );

  const handleProviderUpdate = async (providerDataToUpdate) => {
    try {
      const {
        name,
        certificate,
        signatureAlgorithm,
        issuer,
        entryPoint,
        firstnameAttributeName,
        surnameAttributeName,
        emailAttributeName,
        roleAttributeName,
        active,
        defaultRoleId,
      } = providerDataToUpdate;
      await upsertSamlAuthProvider({
        variables: {
          input: {
            name,
            certificate,
            signatureAlgorithm,
            issuer,
            entryPoint,
            firstnameAttributeName,
            surnameAttributeName,
            emailAttributeName,
            roleAttributeName,
            active,
            defaultRoleId,
          },
        },
      });

      enqueueSnackbar(formatMessage('samlAuthenticationForm.successfullySaved'), {
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
    <Form
      defaultValues={provider || defaultValues}
      onSubmit={handleProviderUpdate}
    >
      <Stack direction="column" gap={2}>
        <Switch
          name="active"
          label={formatMessage('samlAuthenticationForm.active')}
        />
        <TextField
          required={true}
          name="name"
          label={formatMessage('samlAuthenticationForm.name')}
          fullWidth
        />
        <TextField
          required={true}
          name="certificate"
          label={formatMessage('samlAuthenticationForm.certificate')}
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
              label={formatMessage('samlAuthenticationForm.signatureAlgorithm')}
            />
          )}
        />
        <TextField
          required={true}
          name="issuer"
          label={formatMessage('samlAuthenticationForm.issuer')}
          fullWidth
        />
        <TextField
          required={true}
          name="entryPoint"
          label={formatMessage('samlAuthenticationForm.entryPoint')}
          fullWidth
        />
        <TextField
          required={true}
          name="firstnameAttributeName"
          label={formatMessage('samlAuthenticationForm.firstnameAttributeName')}
          fullWidth
        />
        <TextField
          required={true}
          name="surnameAttributeName"
          label={formatMessage('samlAuthenticationForm.surnameAttributeName')}
          fullWidth
        />
        <TextField
          required={true}
          name="emailAttributeName"
          label={formatMessage('samlAuthenticationForm.emailAttributeName')}
          fullWidth
        />
        <TextField
          required={true}
          name="roleAttributeName"
          label={formatMessage('samlAuthenticationForm.roleAttributeName')}
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
              label={formatMessage('samlAuthenticationForm.defaultRole')}
            />
          )}
          loading={isRolesLoading}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          sx={{ boxShadow: 2 }}
          loading={loading}
        >
          {formatMessage('samlAuthenticationForm.save')}
        </LoadingButton>
      </Stack>
    </Form>
  );
}

SamlConfiguration.propTypes = {
  provider: PropTypes.shape({
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
