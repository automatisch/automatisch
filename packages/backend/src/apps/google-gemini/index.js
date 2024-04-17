import defineApp from '../../helpers/define-app.js';
import auth from './auth/index.js';
import actions from './actions/index.js';
import dynamicData from './dynamic-data/index.js';

export default defineApp({
    name: 'Google Gemini',
    key: 'google-gemini',
    iconUrl: 'https://www.gstatic.com/aistudio/ai_studio_favicon_128x128.svg',
    authDocUrl: 'https://ai.google.dev/docs',
    supportsConnections: true,
    baseUrl: 'https://ai.google.dev',
    apiBaseUrl: 'https://generativelanguage.googleapis.com/v1',
    primaryColor: '4285F4',
    auth,
    actions,
    dynamicData,
});