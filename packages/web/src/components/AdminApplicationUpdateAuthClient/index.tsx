import React from 'react';
import { useParams } from 'react-router-dom';
import type { IApp, IJSONObject } from '@automatisch/types';
import { FieldValues, SubmitHandler } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { UPDATE_APP_AUTH_CLIENT } from 'graphql/mutations/update-app-auth-client';

import useAppAuthClient from 'hooks/useAppAuthClient.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import AdminApplicationAuthClientDialog from 'components/AdminApplicationAuthClientDialog';

type AdminApplicationUpdateAuthClientProps = {
  application: IApp;
  onClose: () => void;
};

export default function AdminApplicationUpdateAuthClient(
  props: AdminApplicationUpdateAuthClientProps
): React.ReactElement {
  const { application, onClose } = props;
  const { auth } = application;
  const formatMessage = useFormatMessage();
  const [inProgress, setInProgress] = React.useState(false);
  const [error, setError] = React.useState<IJSONObject | null>(null);

  const { clientId } = useParams();
  const { appAuthClient, loading: loadingAuthClient } =
    useAppAuthClient(clientId);
  const [updateAppAuthClient] = useMutation(UPDATE_APP_AUTH_CLIENT, {
    refetchQueries: ['GetAppAuthClients'],
  });

  const submitHandler: SubmitHandler<FieldValues> = async (values) => {
    if (!appAuthClient) {
      return;
    }
    try {
      setInProgress(true);
      const { name, active, ...formattedAuthDefaults } = values;
      await updateAppAuthClient({
        variables: {
          input: {
            id: appAuthClient.id,
            name,
            active,
            formattedAuthDefaults,
          },
        },
      });

      onClose();
    } catch (err) {
      const error = err as IJSONObject;
      setError((error.graphQLErrors as IJSONObject[])?.[0]);
    } finally {
      setInProgress(false);
    }
  };

  const getAuthFieldsDefaultValues = () => {
    if (!auth?.fields) {
      return {};
    }
    const defaultValues: {
      [key: string]: any;
    } = {};
    auth.fields.forEach((field) => {
      defaultValues[field.key] = field.value;
    });
    return defaultValues;
  };

  return (
    <AdminApplicationAuthClientDialog
      onClose={onClose}
      error={error}
      title={formatMessage('updateAuthClient.title')}
      loading={loadingAuthClient}
      submitHandler={submitHandler}
      authFields={auth?.fields}
      inProgress={inProgress}
      defaultValues={{
        name: appAuthClient?.name || '',
        active: appAuthClient?.active || false,
        ...getAuthFieldsDefaultValues(),
      }}
      disabled={!appAuthClient}
    />
  );
}
