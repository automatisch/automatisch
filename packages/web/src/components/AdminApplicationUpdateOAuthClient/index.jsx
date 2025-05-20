import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AppPropType } from 'propTypes/propTypes';
import useFormatMessage from 'hooks/useFormatMessage';
import AdminApplicationOAuthClientUpdateDialog from 'components/AdminApplicationOAuthClientUpdateDialog';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import useAdminOAuthClient from 'hooks/useAdminOAuthClient.ee';
import useAdminUpdateOAuthClient from 'hooks/useAdminUpdateOAuthClient.ee';
import useAppAuth from 'hooks/useAppAuth';

function AdminApplicationUpdateOAuthClient(props) {
  const { application, onClose } = props;
  const formatMessage = useFormatMessage();
  const { clientId } = useParams();
  const enqueueSnackbar = useEnqueueSnackbar();
  const [defaultValues, setDefaultValues] = useState({
    name: '',
    active: false,
  });

  const { data: adminOAuthClient, isLoading: isAdminOAuthClientLoading } =
    useAdminOAuthClient(application.key, clientId);

  const { data: auth } = useAppAuth(application.key);

  const { mutateAsync: updateOAuthClient, error: updateOAuthClientError } =
    useAdminUpdateOAuthClient(application.key, clientId);
  const [basicDataUpdatePending, setBasicDataUpdatePending] = useState(false);
  const [authDefaultsUpdatePending, setAuthDefaultsUpdatePending] =
    useState(false);

  const authFields = auth?.data?.fields;

  const handleUpdateAuthDefaults = async (values) => {
    if (!adminOAuthClient) {
      return;
    }

    setAuthDefaultsUpdatePending(true);

    await updateOAuthClient(values.formattedAuthDefaults).finally(() => {
      setAuthDefaultsUpdatePending(false);
    });

    setDefaultValues((prev) => ({
      name: prev.name,
      active: prev.active,
      ...values.formattedAuthDefaults,
    }));

    enqueueSnackbar(formatMessage('updateOAuthClient.success'), {
      variant: 'success',
    });
  };

  const handleUpdateBasicData = async (values) => {
    if (!adminOAuthClient) {
      return;
    }
    const { name, active } = values;

    setBasicDataUpdatePending(true);
    await updateOAuthClient({
      name,
      active,
    }).finally(() => {
      setBasicDataUpdatePending(false);
    });

    enqueueSnackbar(formatMessage('updateOAuthClient.success'), {
      variant: 'success',
    });
  };

  const authFieldsDefaultValue = useMemo(() => {
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

  useEffect(() => {
    setDefaultValues({
      name: adminOAuthClient?.data?.name || '',
      active: adminOAuthClient?.data?.active || false,
      ...authFieldsDefaultValue,
    });
  }, [adminOAuthClient, authFieldsDefaultValue]);

  return (
    <AdminApplicationOAuthClientUpdateDialog
      onClose={onClose}
      error={updateOAuthClientError}
      title={formatMessage('updateOAuthClient.title')}
      loading={isAdminOAuthClientLoading}
      submitAuthDefaults={handleUpdateAuthDefaults}
      submitBasicData={handleUpdateBasicData}
      submittingBasicData={basicDataUpdatePending}
      submittingAuthDefaults={authDefaultsUpdatePending}
      authFields={authFields}
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
