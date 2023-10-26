import { QueryResult, useMutation } from '@apollo/client';
import { IRole, TSamlAuthProvider } from '@automatisch/types';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import MuiTextField from '@mui/material/TextField';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';

import ControlledAutocomplete from 'components/ControlledAutocomplete';
import Form from 'components/Form';
import Switch from 'components/Switch';
import TextField from 'components/TextField';

import { UPSERT_SAML_AUTH_PROVIDER } from 'graphql/mutations/upsert-saml-auth-provider';
import useFormatMessage from 'hooks/useFormatMessage';
import useRoles from 'hooks/useRoles.ee';

type SamlConfigurationProps = {
  provider?: TSamlAuthProvider;
  providerLoading: boolean;
  refetchProvider: QueryResult<TSamlAuthProvider | undefined>['refetch'];
};

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

function generateRoleOptions(roles: IRole[]) {
  return roles?.map(({ name: label, id: value }) => ({ label, value }));
}

function SamlConfiguration({
  provider,
  providerLoading,
  refetchProvider,
}: SamlConfigurationProps) {
  const formatMessage = useFormatMessage();
  const { roles, loading: rolesLoading } = useRoles();
  const enqueueSnackbar = useEnqueueSnackbar();
  const [upsertSamlAuthProvider, { loading }] = useMutation(
    UPSERT_SAML_AUTH_PROVIDER
  );

  const handleProviderUpdate = async (
    providerDataToUpdate: Partial<TSamlAuthProvider>
  ) => {
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

      if (!provider?.id) {
        await refetchProvider();
      }

      enqueueSnackbar(formatMessage('authenticationForm.successfullySaved'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-save-saml-provider-success'
        }
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
          loading={rolesLoading}
        />
        <LoadingButton
          type="submit"
          variant="contained"
          color="primary"
          sx={{ boxShadow: 2 }}
          loading={loading}
        >
          {formatMessage('authenticationForm.save')}
        </LoadingButton>
      </Stack>
    </Form>
  );
}

export default SamlConfiguration;
