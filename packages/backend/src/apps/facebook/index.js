import defineApp from '../../helpers/define-app.js';
import addAuthHeader from './common/add-auth-header.js';
import auth from './auth/index.js';
import actions from './actions/index.js';

export default defineApp({
  name: 'Facebook',
  key: 'facebook',
  iconUrl: '{BASE_URL}/apps/facebook/assets/favicon.svg',
  authDocUrl: '{DOCS_URL}/apps/facebook/connection',
  supportsConnections: true,
  baseUrl: 'https://www.facebook.com',
  apiBaseUrl: 'https://graph.facebook.com/v19.0',
  primaryColor: '#1877F2',
  beforeRequest: [addAuthHeader],
  auth,
  actions,
  dynamicData: [
    {
      key: 'listPages',
      name: 'List Pages',
      description: 'List Facebook pages the user has access to',
      run: async ($) => {
        const { pages } = $.auth.data;

        // Check if we already have pages from auth
        if (pages && Array.isArray(pages) && pages.length > 0) {
          return {
            data: pages.map((page) => ({
              value: page.id,
              name: page.name,
            })),
          };
        }

        // Otherwise fetch pages directly
        try {
          const response = await $.http.get('/me/accounts', {
            params: {
              fields: 'id,name,access_token',
            },
          });

          const pagesList = response.data.data || [];

          return {
            data: pagesList.map((page) => ({
              value: page.id,
              name: page.name,
            })),
          };
        } catch (error) {
          console.error('Error fetching Facebook pages:', error);
          return { data: [] };
        }
      },
    },
  ],
});
