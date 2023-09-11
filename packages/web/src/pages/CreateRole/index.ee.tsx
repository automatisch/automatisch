import { useMutation } from '@apollo/client';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import PermissionCatalogField from 'components/PermissionCatalogField/index.ee';
import { useSnackbar } from 'notistack';

import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import TextField from 'components/TextField';
import * as URLS from 'config/urls';
import { CREATE_ROLE } from 'graphql/mutations/create-role.ee';
import {
  RoleWithComputedPermissions,
  getPermissions,
} from 'helpers/computePermissions.ee';
import useFormatMessage from 'hooks/useFormatMessage';

export default function CreateRole(): React.ReactElement {
  const navigate = useNavigate();
  const formatMessage = useFormatMessage();
  const [createRole, { loading }] = useMutation(CREATE_ROLE);
  const { enqueueSnackbar } = useSnackbar();

  const handleRoleCreation = async (
    roleData: Partial<RoleWithComputedPermissions>
  ) => {
    try {
      const permissions = getPermissions(roleData.computedPermissions);

      await createRole({
        variables: {
          input: {
            name: roleData.name,
            description: roleData.description,
            permissions,
          },
        },
      });

      enqueueSnackbar(formatMessage('createRole.successfullyCreated'), {
        variant: 'success',
      });

      navigate(URLS.ROLES);
    } catch (error) {
      throw new Error('Failed while creating!');
    }
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid item xs={12} sx={{ mb: [2, 5] }}>
          <PageTitle>{formatMessage('createRolePage.title')}</PageTitle>
        </Grid>

        <Grid item xs={12} justifyContent="flex-end" sx={{ pt: 5 }}>
          <Form onSubmit={handleRoleCreation}>
            <Stack direction="column" gap={2}>
              <TextField
                required={true}
                name="name"
                label={formatMessage('roleForm.name')}
                fullWidth
              />

              <TextField
                name="description"
                label={formatMessage('roleForm.description')}
                fullWidth
              />

              <PermissionCatalogField
                name="computedPermissions"
                defaultChecked={true}
              />

              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                sx={{ boxShadow: 2 }}
                loading={loading}
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
