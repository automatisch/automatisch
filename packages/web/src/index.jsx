import { createRoot } from 'react-dom/client';
import { Settings } from 'luxon';

import ThemeProvider from 'components/ThemeProvider';
import IntlProvider from 'components/IntlProvider';
import SnackbarProvider from 'components/SnackbarProvider';
import MetadataProvider from 'components/MetadataProvider';
import { AuthenticationProvider } from 'contexts/Authentication';
import QueryClientProvider from 'components/QueryClientProvider';
import Router from 'components/Router';
import routes from './routes';

// Sets the default locale to English for all luxon DateTime instances created afterwards.
Settings.defaultLocale = 'en';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <SnackbarProvider>
      <AuthenticationProvider>
        <QueryClientProvider>
          <IntlProvider>
            <ThemeProvider>
              <MetadataProvider>{routes}</MetadataProvider>
            </ThemeProvider>
          </IntlProvider>
        </QueryClientProvider>
      </AuthenticationProvider>
    </SnackbarProvider>
  </Router>,
);
