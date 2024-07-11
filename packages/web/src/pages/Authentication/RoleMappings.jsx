import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import { useMemo } from 'react';

import Form from 'components/Form';
import { UPSERT_SAML_AUTH_PROVIDERS_ROLE_MAPPINGS } from 'graphql/mutations/upsert-saml-auth-providers-role-mappings';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminSamlAuthProviderRoleMappings from 'hooks/useAdminSamlAuthProviderRoleMappings';
import RoleMappingsFieldArray from './RoleMappingsFieldsArray';

function generateFormRoleMappings(roleMappings) {
  if (roleMappings?.length === 0) {
    return [{ roleId: '', remoteRoleName: '' }];
  }

  return roleMappings?.map(({ roleId, remoteRoleName }) => ({
    roleId,
    remoteRoleName,
  }));
}

function RoleMappings({ provider, providerLoading }) {
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();

  const { data, isLoading: isAdminSamlAuthProviderRoleMappingsLoading } =
    useAdminSamlAuthProviderRoleMappings({
      adminSamlAuthProviderId: provider?.id,
    });
  const roleMappings = data?.data;

  const [
    upsertSamlAuthProvidersRoleMappings,
    { loading: upsertRoleMappingsLoading },
  ] = useMutation(UPSERT_SAML_AUTH_PROVIDERS_ROLE_MAPPINGS);

  const handleRoleMappingsUpdate = async (values) => {
    try {
      if (provider?.id) {
        await upsertSamlAuthProvidersRoleMappings({
          variables: {
            input: {
              samlAuthProviderId: provider.id,
              samlAuthProvidersRoleMappings: values.roleMappings.map(
                ({ roleId, remoteRoleName }) => ({
                  roleId,
                  remoteRoleName,
                }),
              ),
            },
          },
        });

        enqueueSnackbar(formatMessage('roleMappingsForm.successfullySaved'), {
          variant: 'success',
          SnackbarProps: {
            'data-test': 'snackbar-update-role-mappings-success',
          },
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
    [roleMappings],
  );

  if (
    providerLoading ||
    !provider?.id ||
    isAdminSamlAuthProviderRoleMappingsLoading
  ) {
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

RoleMappings.propTypes = {
  provider: PropTypes.shape({
    id: PropTypes.oneOf([PropTypes.number, PropTypes.string]).isRequired,
  }),
  providerLoading: PropTypes.bool,
};

export default RoleMappings;
