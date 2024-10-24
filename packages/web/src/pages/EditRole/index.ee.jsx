import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { merge } from 'lodash';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import PermissionCatalogField from 'components/PermissionCatalogField/index.ee';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import {
  getComputedPermissionsDefaultValues,
  getPermissions,
  getRoleWithComputedPermissions,
} from 'helpers/computePermissions.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminUpdateRole from 'hooks/useAdminUpdateRole';
import useRole from 'hooks/useRole.ee';
import usePermissionCatalog from 'hooks/usePermissionCatalog.ee';

export default function EditRole() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const { roleId } = useParams();
  const { data: roleData, isLoading: isRoleLoading } = useRole({ roleId });
  const { mutateAsync: updateRole, isPending: isUpdateRolePending } =
    useAdminUpdateRole(roleId);
  const { data: permissionCatalogData } = usePermissionCatalog();
  const role = roleData?.data;
  const permissionCatalog = permissionCatalogData?.data;
  const enqueueSnackbar = useEnqueueSnackbar();

  const handleRoleUpdate = async (roleData) => {
    try {
      const newPermissions = getPermissions(roleData.computedPermissions);
      await updateRole({
        name: roleData.name,
        description: roleData.description,
        permissions: newPermissions,
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

  const defaultValues = React.useMemo(() => {
    const roleWithComputedPermissions = getRoleWithComputedPermissions(role);
    const computedPermissionsDefaultValues =
      getComputedPermissionsDefaultValues(permissionCatalog);

    return {
      ...roleWithComputedPermissions,
      computedPermissions: merge(
        {},
        computedPermissionsDefaultValues,
        roleWithComputedPermissions.computedPermissions,
      ),
    };
  }, [role, permissionCatalog]);

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle data-test="edit-role-title">
            {formatMessage('editRolePage.title')}
          </PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <Form defaultValues={defaultValues} onSubmit={handleRoleUpdate}>
            <Stack direction="column" gap={2}>
              {isRoleLoading && (
                <>
                  <Skeleton variant="rounded" height={55} />
                  <Skeleton variant="rounded" height={55} />
                </>
              )}
              {!isRoleLoading && role && (
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
                syncIsCreator
              />
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                sx={{ boxShadow: 2 }}
                loading={isUpdateRolePending}
                disabled={role?.isAdmin || isRoleLoading}
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
