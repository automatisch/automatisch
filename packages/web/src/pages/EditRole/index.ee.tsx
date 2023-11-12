import { useMutation } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import PermissionCatalogField from 'components/PermissionCatalogField/index.ee';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import { UPDATE_ROLE } from 'graphql/mutations/update-role.ee';
import {
  RoleWithComputedPermissions,
  getPermissions,
  getRoleWithComputedPermissions,
} from 'helpers/computePermissions.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useRole from 'hooks/useRole.ee';

type EditRoleParams = {
  roleId: string;
};

export default function EditRole(): React.ReactElement {
  const formatMessage = useFormatMessage();
  const [updateRole, { loading }] = useMutation(UPDATE_ROLE);
  const navigate = useNavigate();
  const { roleId } = useParams<EditRoleParams>();
  const { role, loading: roleLoading } = useRole(roleId);
  const enqueueSnackbar = useEnqueueSnackbar();

  const handleRoleUpdate = async (
    roleData: Partial<RoleWithComputedPermissions>
  ) => {
    try {
      const newPermissions = getPermissions(roleData.computedPermissions);

      await updateRole({
        variables: {
          input: {
            id: roleId,
            name: roleData.name,
            description: roleData.description,
            permissions: newPermissions,
          },
        },
      });

      enqueueSnackbar(formatMessage('editRole.successfullyUpdated'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-edit-role-success',
        },
      });

      navigate(URLS.ROLES);
    } catch (error) {
      throw new Error('Failed while updating!');
    }
  };

  const roleWithComputedPermissions = getRoleWithComputedPermissions(role);

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle data-test="edit-role-title">
            {formatMessage('editRolePage.title')}
          </PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <Form
            defaultValues={roleWithComputedPermissions}
            onSubmit={handleRoleUpdate}
          >
            <Stack direction="column" gap={2}>
              {roleLoading && (
                <>
                  <Skeleton variant="rounded" height={55} />
                  <Skeleton variant="rounded" height={55} />
                </>
              )}
              {!roleLoading && role && (
                <>
                  <TextField
                    disabled={role.isAdmin}
                    required={true}
                    name="name"
                    label={formatMessage('roleForm.name')}
                    data-test="name-input"
                    fullWidth
                  />

                  <TextField
                    disabled={role.isAdmin}
                    name="description"
                    label={formatMessage('roleForm.description')}
                    data-test="description-input"
                    fullWidth
                  />
                </>
              )}

              <PermissionCatalogField
                name="computedPermissions"
                disabled={role?.isAdmin}
              />

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                sx={{ boxShadow: 2 }}
                loading={loading}
                disabled={role?.isAdmin || roleLoading}
                data-test="update-button"
              >
                {formatMessage('editRole.submit')}
              </LoadingButton>
            </Stack>
          </Form>
        </Grid>
      </Grid>
    </Container>
  );
}
