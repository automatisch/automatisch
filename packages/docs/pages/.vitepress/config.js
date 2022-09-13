import { defineConfig } from 'vitepress';

const BASE = process.env.BASE_URL || '/';

export default defineConfig({
  base: BASE,
  lang: 'en-US',
  title: 'automatisch Docs',
  description:
    'Build workflow automation without spending time and money. No code is required.',
  themeConfig: {
    siteTitle: 'automatisch',
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
            { text: 'License', link: '/other/license' },
            { text: 'Community', link: '/other/community' },
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
