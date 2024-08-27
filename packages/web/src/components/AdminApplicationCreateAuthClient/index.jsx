import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/client';

import { AppPropType } from 'propTypes/propTypes';
import { CREATE_APP_CONFIG } from 'graphql/mutations/create-app-config';
import useAppConfig from 'hooks/useAppConfig.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminCreateAppAuthClient from 'hooks/useAdminCreateAppAuthClient.ee';
import AdminApplicationAuthClientDialog from 'components/AdminApplicationAuthClientDialog';
import useAppAuth from 'hooks/useAppAuth';

function AdminApplicationCreateAuthClient(props) {
  const { appKey, onClose } = props;
  const { data: auth } = useAppAuth(appKey);
  const formatMessage = useFormatMessage();

  const { data: appConfig, isLoading: isAppConfigLoading } =
    useAppConfig(appKey);

  const [
    createAppConfig,
    { loading: loadingCreateAppConfig, error: createAppConfigError },
  ] = useMutation(CREATE_APP_CONFIG, {
    refetchQueries: ['GetAppConfig'],
    context: { autoSnackbar: false },
  });

  const {
    mutateAsync: createAppAuthClient,
    isPending: isCreateAppAuthClientPending,
    error: createAppAuthClientError,
  } = useAdminCreateAppAuthClient(appKey);

  const submitHandler = async (values) => {
    let appConfigId = appConfig?.data?.id;

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
      appKey,
      name,
      active,
      formattedAuthDefaults,
    });

    onClose();
  };

  const getAuthFieldsDefaultValues = useCallback(() => {
    if (!auth?.data?.fields) {
      return {};
    }

    const defaultValues = {};

    auth.data.fields.forEach((field) => {
      if (field.value || field.type !== 'string') {
        defaultValues[field.key] = field.value;
      } else if (field.type === 'string') {
        defaultValues[field.key] = '';
      }
    });

    return defaultValues;
  }, [auth?.data?.fields]);

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
      loading={isAppConfigLoading}
      submitHandler={submitHandler}
      authFields={auth?.data?.fields}
      submitting={loadingCreateAppConfig || isCreateAppAuthClientPending}
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
