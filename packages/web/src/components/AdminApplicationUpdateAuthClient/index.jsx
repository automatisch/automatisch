import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { AppPropType } from 'propTypes/propTypes';
import useFormatMessage from 'hooks/useFormatMessage';
import AdminApplicationAuthClientDialog from 'components/AdminApplicationAuthClientDialog';
import useAdminAppAuthClient from 'hooks/useAdminAppAuthClient.ee';
import useAdminUpdateAppAuthClient from 'hooks/useAdminUpdateAppAuthClient.ee';
import useAppAuth from 'hooks/useAppAuth';

function AdminApplicationUpdateAuthClient(props) {
  const { application, onClose } = props;
  const formatMessage = useFormatMessage();
  const { clientId } = useParams();

  const { data: adminAppAuthClient, isLoading: isAdminAuthClientLoading } =
    useAdminAppAuthClient(application.key, clientId);

  const { data: auth } = useAppAuth(application.key);

  const {
    mutateAsync: updateAppAuthClient,
    isPending: isUpdateAppAuthClientPending,
    error: updateAppAuthClientError,
  } = useAdminUpdateAppAuthClient(application.key, clientId);

  const authFields = auth?.data?.fields?.map((field) => ({
    ...field,
    required: false,
  }));

  const submitHandler = async (values) => {
    if (!adminAppAuthClient) {
      return;
    }

    const { name, active, ...formattedAuthDefaults } = values;

    await updateAppAuthClient({
      name,
      active,
      formattedAuthDefaults,
    });

    onClose();
  };

  const getAuthFieldsDefaultValues = useCallback(() => {
    if (!authFields) {
      return {};
    }

    const defaultValues = {};
    authFields.forEach((field) => {
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
      name: adminAppAuthClient?.data?.name || '',
      active: adminAppAuthClient?.data?.active || false,
      ...getAuthFieldsDefaultValues(),
    }),
    [adminAppAuthClient, getAuthFieldsDefaultValues],
  );

  return (
    <AdminApplicationAuthClientDialog
      onClose={onClose}
      error={updateAppAuthClientError}
      title={formatMessage('updateAuthClient.title')}
      loading={isAdminAuthClientLoading}
      submitHandler={submitHandler}
      authFields={authFields}
      submitting={isUpdateAppAuthClientPending}
      defaultValues={defaultValues}
      disabled={!adminAppAuthClient}
    />
  );
}

AdminApplicationUpdateAuthClient.propTypes = {
  application: AppPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AdminApplicationUpdateAuthClient;
