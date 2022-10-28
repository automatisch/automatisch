import { defineConfig } from 'vitepress';
import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { SitemapStream } from 'sitemap';

const BASE = process.env.BASE_URL || '/';

const links = [];
const PROD_BASE_URL = 'https://automatisch.io/docs';

export default defineConfig({
  base: BASE,
  lang: 'en-US',
  title: 'Automatisch Docs',
  description:
    'Build workflow automation without spending time and money. No code is required.',
  cleanUrls: 'with-subfolders',
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
        link: '/connections/twitter',
        activeMatch: '/connections/',
      },
    ],
    sidebar: {
      '/connections/': [
        {
          text: 'Connections',
          collapsible: true,
          items: [
            { text: 'Flickr', link: '/connections/flickr' },
            { text: 'Github', link: '/connections/github' },
            { text: 'Scheduler', link: '/connections/scheduler' },
            { text: 'Slack', link: '/connections/slack' },
            { text: 'SMTP', link: '/connections/smtp' },
            { text: 'Twilio', link: '/connections/twilio' },
            { text: 'Twitter', link: '/connections/twitter' },
            // Temporarily disable following pages until we release github and typeform integrations
            // { text: 'Typeform', link: '/connections/typeform' },
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
            { text: 'Configuration', link: '/advanced/configuration' },
            { text: 'Credentials', link: '/advanced/credentials' },
            { text: 'Telemetry', link: '/advanced/telemetry' },
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
      copyright: 'Copyright © 2022 Automatisch. All rights reserved.',
    },
    algolia: {
      appId: 'I7I8MRYC3P',
      apiKey: '9325eb970bdd6a70b1e35528b39ed2fe',
      indexName: 'automatisch',
    },
  },

  async transformHead(ctx) {
    if (ctx.pageData.relativePath === '') return; // Skip 404 page.

    const isHomepage = ctx.pageData.relativePath === 'index.md';
    let canonicalUrl = PROD_BASE_URL;

    if (!isHomepage) {
      canonicalUrl =
        `${canonicalUrl}/` + ctx.pageData.relativePath.replace('.md', '');
    }

    // Added for logging purposes to check if there is something
    // wrong with the canonical URL in the deployment pipeline.
    console.log('');
    console.log('File path : ', ctx.pageData.relativePath);
    console.log('Canonical URL: ', canonicalUrl);

    return [
      [
        'link',
        {
          rel: 'canonical',
          href: canonicalUrl,
        },
      ],
    ];
  },

  async transformHtml(_, id, { pageData }) {
    if (!/[\\/]404\.html$/.test(id)) {
      let url = pageData.relativePath.replace(/((^|\/)index)?\.md$/, '$2');

      const isHomepage = url === '';

      if (isHomepage) {
        url = '/docs';
      }

      links.push({
        url,
        lastmod: pageData.lastUpdated,
      });
    }
  },

  async buildEnd({ outDir }) {
    const sitemap = new SitemapStream({
      hostname: `${PROD_BASE_URL}/`,
    });

    const writeStream = createWriteStream(resolve(outDir, 'sitemap.xml'));
    sitemap.pipe(writeStream);
    links.forEach((link) => sitemap.write(link));
    sitemap.end();
  },
});
