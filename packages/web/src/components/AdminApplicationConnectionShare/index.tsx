import * as React from 'react';
import { useParams } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import { CircularProgress } from '@mui/material';
import { useMutation } from '@apollo/client';
import { IApp, IRole } from '@automatisch/types';
import { FieldValues, SubmitHandler } from 'react-hook-form';

import { SHARE_CONNECTION } from 'graphql/mutations/share-connection';
import useFormatMessage from 'hooks/useFormatMessage';
import useSharedConnectionRoleIds from 'hooks/useSharedConnectionRoleIds';
import useRoles from 'hooks/useRoles.ee';

import RolesFieldArray from './RolesFieldArray';
import { Form } from './style';

type AdminApplicationConnectionShareProps = {
  onClose: (response: Record<string, unknown>) => void;
  application: IApp;
};

type Params = {
  connectionId: string;
};

function generateRolesData(roles: IRole[], roleIds: string[]) {
  return roles.map(({ id, name }) => ({
    id,
    name,
    checked: roleIds.includes(id),
  }));
}

export default function AdminApplicationConnectionShare(
  props: AdminApplicationConnectionShareProps
): React.ReactElement {
  const { onClose } = props;
  const { connectionId } = useParams() as Params;
  const formatMessage = useFormatMessage();
  const [
    shareConnection,
    { loading: loadingShareConnection, error: shareConnectionError },
  ] = useMutation(SHARE_CONNECTION, {
    context: { autoSnackbar: false },
  });
  const {
    roleIds,
    loading: roleIdsLoading,
    error: roleIdsError,
  } = useSharedConnectionRoleIds(connectionId, {
    context: { autoSnackbar: false },
  });
  const { roles, loading: rolesLoading, error: rolesError } = useRoles();

  const error = shareConnectionError || roleIdsError || rolesError;
  const showDialogContent =
    !roleIdsLoading && !rolesLoading && !roleIdsError && !rolesError;

  const submitHandler: SubmitHandler<FieldValues> = React.useCallback(
    async (data) => {
      const roles = data.roles as {
        id: string;
        name: string;
        checked: boolean;
      }[];

      const response = await shareConnection({
        variables: {
          input: {
            id: connectionId,
            roleIds: roles
              .filter((role) => role.checked)
              .map((role) => role.id),
          },
        },
      });
      onClose(response as Record<string, unknown>);
    },
    []
  );

  const defaultValues = React.useMemo(
    () => ({
      roles: generateRolesData(roles, roleIds),
    }),
    [roles, roleIds]
  );

  return (
    <Dialog open={true} onClose={onClose}>
      <DialogTitle>
        {formatMessage('adminAppsConnections.shareConnection')}
      </DialogTitle>
      {error && (
        <Alert
          severity="error"
          sx={{ mt: 1, fontWeight: 500, wordBreak: 'break-all' }}
        >
          {error.message}
        </Alert>
      )}
      {(roleIdsLoading || rolesLoading) && (
        <CircularProgress sx={{ display: 'block', margin: '20px auto' }} />
      )}
      {showDialogContent && (
        <DialogContent sx={{ pt: '0px !important' }}>
          <DialogContentText tabIndex={-1} component="div">
            <Form
              defaultValues={defaultValues}
              onSubmit={submitHandler}
              render={({ formState: { isDirty } }) => {
                return (
                  <Stack direction="column">
                    <RolesFieldArray />
                    <LoadingButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      sx={{ boxShadow: 2, mt: 5 }}
                      disabled={!isDirty}
                      loading={loadingShareConnection}
                    >
                      {formatMessage('adminAppsConnections.submit')}
                    </LoadingButton>
                  </Stack>
                );
              }}
            ></Form>
          </DialogContentText>
        </DialogContent>
      )}
    </Dialog>
  );
}
