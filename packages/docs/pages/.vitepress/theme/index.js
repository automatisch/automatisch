import DefaultTheme from 'vitepress/theme';
import './custom.css';
import CustomLayout from './CustomLayout.vue';
import { theme } from 'vitepress-openapi/client';
import 'vitepress-openapi/dist/style.css';

export default {
  ...DefaultTheme,
  Layout: CustomLayout,

  async enhanceApp({ app }) {
    theme.enhanceApp({ app });
  },
};
