import { defineConfig } from 'vitepress';

export default defineConfig({
  lang: 'en-US',
  title: 'Automatisch Docs',
  description: 'Vite & Vue powered static site generator.',
  themeConfig: {
    siteTitle: 'Automatisch',
    nav: [
      {
        text: 'Guide',
        link: '/',
        activeMatch: '^/$|^/guide/',
      },
      {
        text: 'Connections',
        link: '/connections/github',
        activeMatch: '/connections/',
      },
    ],
    sidebar: {
      '/connections/': [
        {
          text: 'Connections',
          collapsible: true,
          items: [
            { text: 'Github', link: '/connections/github' },
            { text: 'Scheduler', link: '/connections/scheduler' },
            { text: 'Slack', link: '/connections/slack' },
            { text: 'Twitter', link: '/connections/twitter' },
            { text: 'Typeform', link: '/connections/typeform' },
          ],
        },
      ],
      '/': [
        {
          text: 'Getting Started',
          collapsible: true,
          items: [
            {
              text: 'What is Automatisch?',
              link: '/',
              activeMatch: '/',
            },
            { text: 'Installation', link: '/guide/installation' },
            { text: 'Key concepts', link: '/guide/key-concepts' },
            { text: 'Create flow', link: '/guide/create-flow' },
          ],
        },
        {
          text: 'Integrations',
          collapsible: true,
          items: [
            { text: 'Available apps', link: '/guide/available-apps' },
            {
              text: 'Request integration',
              link: '/guide/request-integration',
            },
          ],
        },
        {
          text: 'Advanced',
          collapsible: true,
          items: [
            { text: 'Configuration', link: '/introduction' },
            { text: 'Database', link: '/introduction' },
            { text: 'Credentials', link: '/introduction' },
            { text: 'Deployment', link: '/introduction' },
          ],
        },
        {
          text: 'Contributing',
          collapsible: true,
          items: [
            { text: 'Contribution guide', link: '/introduction' },
            { text: 'Build integration', link: '/introduction' },
          ],
        },
        {
          text: 'Other',
          collapsible: true,
          items: [
            { text: 'License', link: '/introduction' },
            { text: 'Community', link: '/introduction' },
            { text: 'F.A.Q', link: '/introduction' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/automatisch/automatisch' },
      { icon: 'twitter', link: 'https://twitter.com/automatischio' },
      { icon: 'discord', link: 'https://discord.gg/dJSah9CVrC' },
    ],
    editLink: {
      pattern:
        'https://github.com/automatisch/automatisch/edit/main/packages/docs/pages/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      copyright: 'Copyright © 2021 Automatisch. All rights reserved.',
    },
  },
});
