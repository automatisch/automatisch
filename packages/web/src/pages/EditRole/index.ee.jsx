import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { merge } from 'lodash';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

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

const getValidationSchema = (formatMessage) => {
  const getMandatoryFieldMessage = (fieldTranslationId) =>
    formatMessage('roleForm.mandatoryInput', {
      inputName: formatMessage(fieldTranslationId),
    });

  return yup.object().shape({
    name: yup
      .string()
      .trim()
      .required(getMandatoryFieldMessage('roleForm.name')),
    description: yup.string().trim(),
  });
};

const getPermissionsErrorMessage = (error) => {
  const errors = error?.response?.data?.errors;

  if (errors) {
    const permissionsErrors = Object.keys(errors)
      .filter((key) => key.startsWith('permissions'))
      .reduce((obj, key) => {
        obj[key] = errors[key];
        return obj;
      }, {});

    if (Object.keys(permissionsErrors).length > 0) {
      return JSON.stringify(permissionsErrors, null, 2);
    }
  }

  return null;
};

export default function EditRole() {
  const formatMessage = useFormatMessage();
  const navigate = useNavigate();
  const { roleId } = useParams();
  const { data: roleData, isLoading: isRoleLoading } = useRole({ roleId });
  const { mutateAsync: updateRole, isPending: isUpdateRolePending } =
    useAdminUpdateRole(roleId);
  const { data: permissionCatalogData, isLoading: isPermissionCatalogLoading } =
    usePermissionCatalog();
  const role = roleData?.data;
  const permissionCatalog = permissionCatalogData?.data;
  const enqueueSnackbar = useEnqueueSnackbar();
  const [permissionError, setPermissionError] = React.useState(null);

  const handleRoleUpdate = async (roleData) => {
    try {
      setPermissionError(null);
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
      const permissionError = getPermissionsErrorMessage(error);
      if (permissionError) {
        setPermissionError(permissionError);
      }

      const errors = error?.response?.data?.errors;
      throw errors || error;
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
          <Form
            noValidate
            defaultValues={defaultValues}
            onSubmit={handleRoleUpdate}
            resolver={yupResolver(getValidationSchema(formatMessage))}
            automaticValidation={false}
            render={({ formState: { errors } }) => (
              <Stack direction="column" gap={2}>
                <TextField
                  disabled={
                    role?.isAdmin || isRoleLoading || isPermissionCatalogLoading
                  }
                  required
                  name="name"
                  label={formatMessage('roleForm.name')}
                  data-test="name-input"
                  fullWidth
                  error={!!errors?.name}
                  helperText={errors?.name?.message}
                />
                <TextField
                  disabled={
                    role?.isAdmin || isRoleLoading || isPermissionCatalogLoading
                  }
                  name="description"
                  label={formatMessage('roleForm.description')}
                  data-test="description-input"
                  fullWidth
                  error={!!errors?.description}
                  helperText={errors?.description?.message}
                />
                <PermissionCatalogField
                  name="computedPermissions"
                  disabled={role?.isAdmin}
                  syncIsCreator
                  loading={isRoleLoading}
                />
                {permissionError && (
                  <Alert severity="error" data-test="edit-role-error-alert">
                    <AlertTitle>
                      {formatMessage('editRolePage.permissionsError')}
                    </AlertTitle>
                    <pre>
                      <code>{permissionError}</code>
                    </pre>
                  </Alert>
                )}
                {errors?.root?.general && !permissionError && (
                  <Alert severity="error" data-test="edit-role-error-alert">
                    {errors?.root?.general?.message}
                  </Alert>
                )}
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
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
