import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import PermissionCatalogField from 'components/PermissionCatalogField/index.ee';
import useEnqueueSnackbar from 'hooks/useEnqueueSnackbar';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Container from 'components/Container';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import {
  getComputedPermissionsDefaultValues,
  getPermissions,
} from 'helpers/computePermissions.ee';
import { getGeneralErrorMessage } from 'helpers/errors';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminCreateRole from 'hooks/useAdminCreateRole';
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

  const handleRoleCreation = async (roleData, e, setError) => {
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
      const errors = error?.response?.data?.errors;

      if (errors) {
        const fieldNames = ['name', 'description'];
        Object.entries(errors).forEach(([fieldName, fieldErrors]) => {
          if (fieldNames.includes(fieldName) && Array.isArray(fieldErrors)) {
            setError(fieldName, {
              type: 'fieldRequestError',
              message: fieldErrors.join(', '),
            });
          }
        });
      }

      const permissionError = getPermissionsErrorMessage(error);

      if (permissionError) {
        setError('root.permissions', {
          type: 'fieldRequestError',
          message: permissionError,
        });
      }

      const generalError = getGeneralErrorMessage({
        error,
        fallbackMessage: formatMessage('createRole.generalError'),
      });

      if (generalError) {
        setError('root.general', {
          type: 'requestError',
          message: generalError,
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
          <Form
            onSubmit={handleRoleCreation}
            defaultValues={defaultValues}
            noValidate
            resolver={yupResolver(
              getValidationSchema(formatMessage, defaultValues),
            )}
            automaticValidation={false}
            render={({ formState: { errors } }) => (
              <Stack direction="column" gap={2}>
                <TextField
                  required={true}
                  name="name"
                  label={formatMessage('roleForm.name')}
                  fullWidth
                  data-test="name-input"
                  error={!!errors?.name}
                  helperText={errors?.name?.message}
                />

                <TextField
                  name="description"
                  label={formatMessage('roleForm.description')}
                  fullWidth
                  data-test="description-input"
                  error={!!errors?.description}
                  helperText={errors?.description?.message}
                />

                <PermissionCatalogField name="computedPermissions" />

                {errors?.root?.permissions && (
                  <Alert severity="error" data-test="create-role-error-alert">
                    <AlertTitle>
                      {formatMessage('createRole.permissionsError')}
                    </AlertTitle>
                    <pre>
                      <code>{errors?.root?.permissions?.message}</code>
                    </pre>
                  </Alert>
                )}

                {errors?.root?.general && (
                  <Alert severity="error" data-test="create-role-error-alert">
                    {errors?.root?.general?.message}
                  </Alert>
                )}

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
            )}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
