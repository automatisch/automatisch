// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Automatisch Docs',
  tagline: 'Automatisch Docs',
  url: 'https://docs.automatisch.io',
  baseUrl: '/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'automatisch', // Usually your GitHub org/user name.
  projectName: 'automatisch', // Usually your repo name.

  presets: [
    [
      '@docusaurus/preset-classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/automatisch/automatisch/edit/main/packages/docs',
          routeBasePath: '/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/edit/main/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Automatisch',
        items: [
          {
            type: 'doc',
            docId: 'introduction',
            position: 'left',
            label: 'Docs',
          },
          {
            href: 'https://discord.gg/dJSah9CVrC',
            label: 'Discord',
            position: 'right',
          },
          {
            href: 'https://github.com/automatisch/automatisch',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting Started',
                to: '/docs/intro',
              },
              {
                label: 'Integrations',
                to: '/docs/intro',
              },
              {
                label: 'License',
                to: '/docs/intro',
              },
              {
                label: 'F.A.Q.',
                to: '/docs/intro',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'GitHub',
                href: 'https://github.com/automatisch/automatisch',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/dJSah9CVrC',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/automatischio',
              },
            ],
          },
          {
            title: 'Explore',
            items: [
              {
                label: 'Read our blog',
                href: 'https://github.com/automatisch/automatisch',
              },
            ],
          },
        ],
        copyright: `© 2021 Automatisch. All rights reserved.`,
      },
      prism: {
        theme: require('prism-react-renderer/themes/dracula'),
        darkTheme: darkCodeTheme,
      },
      colorMode: {
        disableSwitch: true,
      },
    }),
};

module.exports = config;
