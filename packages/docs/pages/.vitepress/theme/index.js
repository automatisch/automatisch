import DefaultTheme from 'vitepress/theme';
import './custom.css';
import CustomLayout from './CustomLayout.vue';
import { theme, useOpenapi } from 'vitepress-openapi/client';
import 'vitepress-openapi/dist/style.css';

export default {
  ...DefaultTheme,
  Layout: CustomLayout,

  async enhanceApp({ app }) {
    const OPENAPI_JSON_URL =
      import.meta.env.VITE_OPENAPI_JSON_URL ||
      'http://localhost:3000/api/openapi.json';

    const openapiSpec = await (await fetch(OPENAPI_JSON_URL)).json();

    // Set the OpenAPI specification.
    useOpenapi({
      spec: openapiSpec,
    });

    theme.enhanceApp({ app });
  },
};
