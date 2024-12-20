import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { AppPropType } from 'propTypes/propTypes';
import useAdminCreateAppConfig from 'hooks/useAdminCreateAppConfig';
import useAppConfig from 'hooks/useAppConfig.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminCreateOAuthClient from 'hooks/useAdminCreateOAuthClient.ee';
import AdminApplicationOAuthClientDialog from 'components/AdminApplicationOAuthClientDialog';
import useAppAuth from 'hooks/useAppAuth';

function AdminApplicationCreateOAuthClient(props) {
  const { appKey, onClose } = props;
  const { data: auth } = useAppAuth(appKey);
  const formatMessage = useFormatMessage();

  const { data: appConfig, isLoading: isAppConfigLoading } =
    useAppConfig(appKey);

  const {
    mutateAsync: createAppConfig,
    isPending: isCreateAppConfigPending,
    error: createAppConfigError,
  } = useAdminCreateAppConfig(props.appKey);

  const {
    mutateAsync: createOAuthClient,
    isPending: isCreateOAuthClientPending,
    error: createOAuthClientError,
  } = useAdminCreateOAuthClient(appKey);

  const submitHandler = async (values) => {
    let appConfigKey = appConfig?.data?.key;

    if (!appConfigKey) {
      const { data: appConfigData } = await createAppConfig({
        useOnlyPredefinedAuthClients: false,
        disabled: false,
      });

      appConfigKey = appConfigData.key;
    }

    const { name, active, ...formattedAuthDefaults } = values;

    await createOAuthClient({
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
    <AdminApplicationOAuthClientDialog
      onClose={onClose}
      error={createAppConfigError || createOAuthClientError}
      title={formatMessage('createOAuthClient.title')}
      loading={isAppConfigLoading}
      submitHandler={submitHandler}
      authFields={auth?.data?.fields}
      submitting={isCreateAppConfigPending || isCreateOAuthClientPending}
      defaultValues={defaultValues}
    />
  );
}

AdminApplicationCreateOAuthClient.propTypes = {
  appKey: PropTypes.string.isRequired,
  application: AppPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AdminApplicationCreateOAuthClient;
