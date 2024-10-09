import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';

import { AppPropType } from 'propTypes/propTypes';
import useAdminCreateAppConfig from 'hooks/useAdminCreateAppConfig';
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

  const {
    mutateAsync: createAppConfig,
    isPending: isCreateAppConfigPending,
    error: createAppConfigError,
  } = useAdminCreateAppConfig(props.appKey);

  const {
    mutateAsync: createAppAuthClient,
    isPending: isCreateAppAuthClientPending,
    error: createAppAuthClientError,
  } = useAdminCreateAppAuthClient(appKey);

  const submitHandler = async (values) => {
    let appConfigId = appConfig?.data?.id;

    if (!appConfigId) {
      const { data: appConfigData } = await createAppConfig({
        customConnectionAllowed: true,
        shared: false,
        disabled: false,
      });

      appConfigId = appConfigData.id;
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
      submitting={isCreateAppConfigPending || isCreateAppAuthClientPending}
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
