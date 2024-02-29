import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/client';

import { AppPropType } from 'propTypes/propTypes';
import { CREATE_APP_CONFIG } from 'graphql/mutations/create-app-config';
import { CREATE_APP_AUTH_CLIENT } from 'graphql/mutations/create-app-auth-client';
import useAppConfig from 'hooks/useAppConfig.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import AdminApplicationAuthClientDialog from 'components/AdminApplicationAuthClientDialog';

function AdminApplicationCreateAuthClient(props) {
  const { appKey, application, onClose } = props;
  const { auth } = application;
  const formatMessage = useFormatMessage();
  const { appConfig, loading: loadingAppConfig } = useAppConfig(appKey);
  const [
    createAppConfig,
    { loading: loadingCreateAppConfig, error: createAppConfigError },
  ] = useMutation(CREATE_APP_CONFIG, {
    refetchQueries: ['GetAppConfig'],
    context: { autoSnackbar: false },
  });
  const [
    createAppAuthClient,
    { loading: loadingCreateAppAuthClient, error: createAppAuthClientError },
  ] = useMutation(CREATE_APP_AUTH_CLIENT, {
    refetchQueries: ['GetAppAuthClients'],
    context: { autoSnackbar: false },
  });
  const submitHandler = async (values) => {
    let appConfigId = appConfig?.id;
    if (!appConfigId) {
      const { data: appConfigData } = await createAppConfig({
        variables: {
          input: {
            key: appKey,
            allowCustomConnection: false,
            shared: false,
            disabled: false,
          },
        },
      });
      appConfigId = appConfigData.createAppConfig.id;
    }
    const { name, active, ...formattedAuthDefaults } = values;
    await createAppAuthClient({
      variables: {
        input: {
          appConfigId,
          name,
          active,
          formattedAuthDefaults,
        },
      },
    });
    onClose();
  };
  const getAuthFieldsDefaultValues = useCallback(() => {
    if (!auth?.fields) {
      return {};
    }
    const defaultValues = {};
    auth.fields.forEach((field) => {
      if (field.value || field.type !== 'string') {
        defaultValues[field.key] = field.value;
      } else if (field.type === 'string') {
        defaultValues[field.key] = '';
      }
    });
    return defaultValues;
  }, [auth?.fields]);
  const defaultValues = useMemo(
    () => ({
      name: '',
      active: false,
      ...getAuthFieldsDefaultValues(),
    }),
    [getAuthFieldsDefaultValues],
  );
  return (
    <AdminApplicationAuthClientDialog
      onClose={onClose}
      error={createAppConfigError || createAppAuthClientError}
      title={formatMessage('createAuthClient.title')}
      loading={loadingAppConfig}
      submitHandler={submitHandler}
      authFields={auth?.fields}
      submitting={loadingCreateAppConfig || loadingCreateAppAuthClient}
      defaultValues={defaultValues}
    />
  );
}

AdminApplicationCreateAuthClient.propTypes = {
  appKey: PropTypes.string.isRequired,
  application: AppPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AdminApplicationCreateAuthClient;
