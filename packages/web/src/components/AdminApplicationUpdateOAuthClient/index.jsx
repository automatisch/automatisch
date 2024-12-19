import PropTypes from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { AppPropType } from 'propTypes/propTypes';
import useFormatMessage from 'hooks/useFormatMessage';
import AdminApplicationOAuthClientDialog from 'components/AdminApplicationOAuthClientDialog';
import useAdminOAuthClient from 'hooks/useAdminOAuthClient.ee';
import useAdminUpdateOAuthClient from 'hooks/useAdminUpdateOAuthClient.ee';
import useAppAuth from 'hooks/useAppAuth';

function AdminApplicationUpdateOAuthClient(props) {
  const { application, onClose } = props;
  const formatMessage = useFormatMessage();
  const { clientId } = useParams();

  const { data: adminOAuthClient, isLoading: isAdminOAuthClientLoading } =
    useAdminOAuthClient(application.key, clientId);

  const { data: auth } = useAppAuth(application.key);

  const {
    mutateAsync: updateOAuthClient,
    isPending: isUpdateOAuthClientPending,
    error: updateOAuthClientError,
  } = useAdminUpdateOAuthClient(application.key, clientId);

  const authFields = auth?.data?.fields?.map((field) => ({
    ...field,
    required: false,
  }));

  const submitHandler = async (values) => {
    if (!adminOAuthClient) {
      return;
    }

    const { name, active, ...formattedAuthDefaults } = values;

    await updateOAuthClient({
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
      name: adminOAuthClient?.data?.name || '',
      active: adminOAuthClient?.data?.active || false,
      ...getAuthFieldsDefaultValues(),
    }),
    [adminOAuthClient, getAuthFieldsDefaultValues],
  );

  return (
    <AdminApplicationOAuthClientDialog
      onClose={onClose}
      error={updateOAuthClientError}
      title={formatMessage('updateOAuthClient.title')}
      loading={isAdminOAuthClientLoading}
      submitHandler={submitHandler}
      authFields={authFields}
      submitting={isUpdateOAuthClientPending}
      defaultValues={defaultValues}
      disabled={!adminOAuthClient}
    />
  );
}

AdminApplicationUpdateOAuthClient.propTypes = {
  application: AppPropType.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default AdminApplicationUpdateOAuthClient;
