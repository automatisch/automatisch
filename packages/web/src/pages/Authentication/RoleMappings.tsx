import { useMutation } from '@apollo/client';
import { TSamlAuthProvider, TSamlAuthProviderRole } from '@automatisch/types';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import { useMemo } from 'react';

import Form from 'components/Form';
import { UPSERT_SAML_AUTH_PROVIDERS_ROLE_MAPPINGS } from 'graphql/mutations/upsert-saml-auth-providers-role-mappings';
import useFormatMessage from 'hooks/useFormatMessage';
import useSamlAuthProviderRoleMappings from 'hooks/useSamlAuthProviderRoleMappings';

import RoleMappingsFieldArray from './RoleMappingsFieldsArray';

type RoleMappingsProps = {
  provider?: TSamlAuthProvider;
  providerLoading: boolean;
};

function generateFormRoleMappings(roleMappings: TSamlAuthProviderRole[]) {
  if (roleMappings.length === 0) {
    return [{ roleId: '', remoteRoleName: '' }];
  }

  return roleMappings.map(({ roleId, remoteRoleName }) => ({
    roleId,
    remoteRoleName,
  }));
}

function RoleMappings({ provider, providerLoading }: RoleMappingsProps) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { roleMappings, loading: roleMappingsLoading } =
    useSamlAuthProviderRoleMappings(provider?.id);
  const [
    upsertSamlAuthProvidersRoleMappings,
    { loading: upsertRoleMappingsLoading },
  ] = useMutation(UPSERT_SAML_AUTH_PROVIDERS_ROLE_MAPPINGS);

  const handleRoleMappingsUpdate = async (values: any) => {
    try {
      if (provider?.id) {
        await upsertSamlAuthProvidersRoleMappings({
          variables: {
            input: {
              samlAuthProviderId: provider.id,
              samlAuthProvidersRoleMappings: values.roleMappings.map(
                ({
                  roleId,
                  remoteRoleName,
                }: {
                  roleId: string;
                  remoteRoleName: string;
                }) => ({
                  roleId,
                  remoteRoleName,
                })
              ),
            },
          },
        });
        enqueueSnackbar(formatMessage('roleMappingsForm.successfullySaved'), {
          variant: 'success',
          SnackbarProps: {
            'data-test': 'snackbar-update-role-mappings-success'
          }
        });
      }
    } catch (error) {
      throw new Error('Failed while saving!');
    }
  };

  const defaultValues = useMemo(
    () => ({
      roleMappings: generateFormRoleMappings(roleMappings),
    }),
    [roleMappings]
  );

  if (providerLoading || !provider?.id || roleMappingsLoading) {
    return null;
  }

  return (
    <>
      <Divider sx={{ pt: 2 }} />
      <Typography variant="h3">
        {formatMessage('roleMappingsForm.title')}
      </Typography>
      <Form defaultValues={defaultValues} onSubmit={handleRoleMappingsUpdate}>
        <Stack direction="column" spacing={2}>
          <RoleMappingsFieldArray />
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            sx={{ boxShadow: 2 }}
            loading={upsertRoleMappingsLoading}
          >
            {formatMessage('roleMappingsForm.save')}
          </LoadingButton>
        </Stack>
      </Form>
    </>
  );
}

export default RoleMappings;
