import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import PermissionCatalogField from 'components/PermissionCatalogField/index.ee';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import {
  getComputedPermissionsDefaultValues,
  getPermissions,
} from 'helpers/computePermissions.ee';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminCreateRole from 'hooks/useAdminCreateRole';
import usePermissionCatalog from 'hooks/usePermissionCatalog.ee';

export default function CreateRole() {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const enqueueSnackbar = useEnqueueSnackbar();
  const { mutateAsync: createRole, isPending: isCreateRolePending } =
    useAdminCreateRole();
  const { data: permissionCatalogData } = usePermissionCatalog();

  const defaultValues = React.useMemo(
    () => ({
      name: '',
      description: '',
      computedPermissions: getComputedPermissionsDefaultValues(
        permissionCatalogData?.data,
        {
          isCreator: true,
        },
      ),
    }),
    [permissionCatalogData],
  );

  const handleRoleCreation = async (roleData) => {
    try {
      const permissions = getPermissions(roleData.computedPermissions);

      await createRole({
        name: roleData.name,
        description: roleData.description,
        permissions,
      });

      enqueueSnackbar(formatMessage('createRole.successfullyCreated'), {
        variant: 'success',
        SnackbarProps: {
          'data-test': 'snackbar-create-role-success',
        },
      });

      navigate(URLS.ROLES);
    } catch (error) {
      const errors = Object.values(error.response.data.errors);

      for (const [errorMessage] of errors) {
        enqueueSnackbar(errorMessage, {
          variant: 'error',
          SnackbarProps: {
            'data-test': 'snackbar-error',
          },
        });
      }
    }
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle data-test="create-role-title">
            {formatMessage('createRolePage.title')}
          </PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <Form onSubmit={handleRoleCreation} defaultValues={defaultValues}>
            <Stack direction="column" gap={2}>
              <TextField
                required={true}
                name="name"
                label={formatMessage('roleForm.name')}
                fullWidth
                data-test="name-input"
              />

              <TextField
                name="description"
                label={formatMessage('roleForm.description')}
                fullWidth
                data-test="description-input"
              />

              <PermissionCatalogField name="computedPermissions" />

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                sx={{ boxShadow: 2 }}
                loading={isCreateRolePending}
                data-test="create-button"
              >
                {formatMessage('createRole.submit')}
              </LoadingButton>
            </Stack>
          </Form>
        </Grid>
      </Grid>
    </Container>
  );
}
