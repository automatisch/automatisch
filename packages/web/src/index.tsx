import React from 'react';
import ReactDOM from 'react-dom';
import Layout from 'components/Layout';
import ThemeProvider from 'components/ThemeProvider';
import IntlProvider from 'components/IntlProvider';
import ApolloProvider from 'components/ApolloProvider';
import Router from 'components/Router';
import routes from 'routes';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <ApolloProvider>
    <IntlProvider>
      <ThemeProvider>
        <Router>
          <Layout>
            {routes}
          </Layout>
        </Router>
      </ThemeProvider>
    </IntlProvider>
  </ApolloProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
