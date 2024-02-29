import { createRoot } from 'react-dom/client';
import ThemeProvider from 'components/ThemeProvider';
import IntlProvider from 'components/IntlProvider';
import ApolloProvider from 'components/ApolloProvider';
import SnackbarProvider from 'components/SnackbarProvider';
import MetadataProvider from 'components/MetadataProvider';
import { AuthenticationProvider } from 'contexts/Authentication';
import { AutomatischInfoProvider } from 'contexts/AutomatischInfo';
import QueryClientProvider from 'components/QueryClientProvider';
import Router from 'components/Router';
import LiveChat from 'components/LiveChat/index.ee';
import routes from 'routes';
import reportWebVitals from './reportWebVitals';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Router>
    <SnackbarProvider>
      <AuthenticationProvider>
        <QueryClientProvider>
          <ApolloProvider>
            <AutomatischInfoProvider>
              <IntlProvider>
                <ThemeProvider>
                  <MetadataProvider>
                    {routes}

                    <LiveChat />
                  </MetadataProvider>
                </ThemeProvider>
              </IntlProvider>
            </AutomatischInfoProvider>
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
