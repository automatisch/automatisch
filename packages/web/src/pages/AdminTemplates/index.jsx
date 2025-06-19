import * as React from 'react';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';

import Switch from 'components/Switch';
import Form from 'components/Form';
import PageTitle from 'components/PageTitle';
import Container from 'components/Container';
import SearchInput from 'components/SearchInput';
import TemplateItem from 'components/TemplatesDialog/TemplateItem/TemplateItem.ee.jsx';
import * as URLS from 'config/urls';
import useFormatMessage from 'hooks/useFormatMessage';
import useAdminTemplates from 'hooks/useAdminTemplates.ee';
import useAdminUpdateConfig from 'hooks/useAdminUpdateConfig';
import useAutomatischConfig from 'hooks/useAutomatischConfig';
import NoResultFound from 'components/NoResultFound';

function AdminTemplates() {
  const formatMessage = useFormatMessage();
  const [templateName, setTemplateName] = React.useState('');

  const { data: config } = useAutomatischConfig();

  const { data: templates, isLoading: isTemplatesLoading } = useAdminTemplates({
    name: templateName,
  });

  const { mutateAsync: updateConfig, isPending: isUpdateConfigPending } =
    useAdminUpdateConfig();

  const onSearchChange = React.useCallback((event) => {
    setTemplateName(event.target.value);
  }, []);

  const handleChangeOnFeatureToggle = async (event) => {
    const value = event.target.checked;

    await updateConfig({ enableTemplates: value });
  };

  return (
    <Container sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Grid container item xs={12} sm={10} md={9}>
        <Grid container sx={{ mb: [0, 3] }} columnSpacing={1.5} rowSpacing={3}>
          <Grid container item xs sm alignItems="center" order={{ xs: 0 }}>
            <PageTitle>{formatMessage('adminTemplatesPage.title')}</PageTitle>
          </Grid>

          <Grid item xs={12} sm="auto" order={{ xs: 2, sm: 1 }}>
            <SearchInput onChange={onSearchChange} />
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ mt: [2, 0], mb: 2 }} />
        </Grid>

        <Grid item xs={12} sx={{ mb: 3 }}>
          <Form
            defaultValues={{ enableTemplates: config?.data.enableTemplates }}
            noValidate
            automaticValidation={false}
            render={() => (
              <Switch
                name="enableTemplates"
                disabled={isUpdateConfigPending}
                onChange={handleChangeOnFeatureToggle}
                label={formatMessage('authenticationForm.active')}
              />
            )}
          />
        </Grid>

        {isTemplatesLoading && (
          <CircularProgress
            data-test="templates-loader"
            sx={{ display: 'block', margin: '20px auto' }}
          />
        )}

        <Grid item xs={12}>
          {!isTemplatesLoading &&
            templates?.data?.map((template) => (
              <TemplateItem
                key={template.name}
                template={template}
                to={URLS.ADMIN_UPDATE_TEMPLATE(template.id)}
              />
            ))}

          {!isTemplatesLoading && templates?.meta.count === 0 && (
            <NoResultFound
              text={formatMessage('adminTemplatesPage.noResult')}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminTemplates;
