import { createRoot } from 'react-dom/client';
import { Settings } from 'luxon';

import ThemeProvider from 'components/ThemeProvider';
import IntlProvider from 'components/IntlProvider';
import ApolloProvider from 'components/ApolloProvider';
import SnackbarProvider from 'components/SnackbarProvider';
import MetadataProvider from 'components/MetadataProvider';
import { AuthenticationProvider } from 'contexts/Authentication';
import QueryClientProvider from 'components/QueryClientProvider';
import Router from 'components/Router';
import routes from 'routes';
import reportWebVitals from './reportWebVitals';

// Sets the default locale to English for all luxon DateTime instances created afterwards.
Settings.defaultLocale = 'en';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <SnackbarProvider>
      <AuthenticationProvider>
        <QueryClientProvider>
          <ApolloProvider>
            <IntlProvider>
              <ThemeProvider>
                <MetadataProvider>{routes}</MetadataProvider>
              </ThemeProvider>
            </IntlProvider>
          </ApolloProvider>
        </QueryClientProvider>
      </AuthenticationProvider>
    </SnackbarProvider>
  </Router>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
