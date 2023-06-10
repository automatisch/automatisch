import defineApp from '../../helpers/define-app';

export default defineApp({
    name: 'Odoo',
    key: 'odoo',
    iconUrl: '{BASE_URL}/apps/odoo/assets/favicon.svg',
    authDocUrl: 'https://automatisch.io/docs/apps/odoo/connection',
    supportsConnections: true,
    baseUrl: 'https://odoo.com',
    apiBaseUrl: 'https://odoo.com',
    primaryColor: '714B67',
});
