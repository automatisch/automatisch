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
  ignoreDeadLinks: true,
  themeConfig: {
    siteTitle: 'Automatisch',
    nav: [
      {
        text: 'Guide',
        link: '/',
        activeMatch: '^/$|^/guide/',
      },
      {
        text: 'Apps',
        link: '/apps/carbone/connection',
        activeMatch: '/apps/',
      },
    ],
    sidebar: {
      '/apps/': [
        {
          text: 'Carbone',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/carbone/actions' },
            { text: 'Connection', link: '/apps/carbone/connection' },
          ],
        },
        {
          text: 'Changedetection',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/changedetection/triggers' },
            { text: 'Actions', link: '/apps/changedetection/actions' },
            { text: 'Connection', link: '/apps/changedetection/connection' },
          ],
        },
        {
          text: 'Datastore',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/datastore/actions' },
            { text: 'Connection', link: '/apps/datastore/connection' },
          ],
        },
        {
          text: 'DeepL',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/deepl/actions' },
            { text: 'Connection', link: '/apps/deepl/connection' },
          ],
        },
        {
          text: 'Delay',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/delay/actions' },
            { text: 'Connection', link: '/apps/delay/connection' },
          ],
        },
        {
          text: 'Discord',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/discord/actions' },
            { text: 'Connection', link: '/apps/discord/connection' },
          ],
        },
        {
          text: 'Disqus',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/disqus/triggers' },
            { text: 'Connection', link: '/apps/disqus/connection' },
          ],
        },
        {
          text: 'Dropbox',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/dropbox/actions' },
            { text: 'Connection', link: '/apps/dropbox/connection' },
          ],
        },
        {
          text: 'Filter',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/filter/actions' },
            { text: 'Connection', link: '/apps/filter/connection' },
          ],
        },
        {
          text: 'Flickr',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/flickr/triggers' },
            { text: 'Connection', link: '/apps/flickr/connection' },
          ],
        },
        {
          text: 'Formatter',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/formatter/actions' },
            { text: 'Connection', link: '/apps/formatter/connection' },
          ],
        },
        {
          text: 'Ghost',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/ghost/triggers' },
            { text: 'Connection', link: '/apps/ghost/connection' },
          ],
        },
        {
          text: 'GitHub',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/github/triggers' },
            { text: 'Actions', link: '/apps/github/actions' },
            { text: 'Connection', link: '/apps/github/connection' },
          ],
        },
        {
          text: 'GitLab',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/gitlab/triggers' },
            { text: 'Connection', link: '/apps/gitlab/connection' },
          ],
        },
        {
          text: 'Google Calendar',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/google-calendar/triggers' },
            { text: 'Connection', link: '/apps/google-calendar/connection' },
          ],
        },
        {
          text: 'Google Drive',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/google-drive/triggers' },
            { text: 'Connection', link: '/apps/google-drive/connection' },
          ],
        },
        {
          text: 'Google Forms',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/google-forms/triggers' },
            { text: 'Connection', link: '/apps/google-forms/connection' },
          ],
        },
        {
          text: 'Google Sheets',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/google-sheets/triggers' },
            { text: 'Actions', link: '/apps/google-sheets/actions' },
            { text: 'Connection', link: '/apps/google-sheets/connection' },
          ],
        },
        {
          text: 'Google Tasks',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/google-tasks/triggers' },
            { text: 'Actions', link: '/apps/google-tasks/actions' },
            { text: 'Connection', link: '/apps/google-tasks/connection' },
          ],
        },
        {
          text: 'HTTP Request',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/http-request/actions' },
            { text: 'Connection', link: '/apps/http-request/connection' },
          ],
        },
        {
          text: 'HubSpot',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/hubspot/actions' },
            { text: 'Connection', link: '/apps/hubspot/connection' },
          ],
        },
        {
          text: 'Invoice Ninja',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/invoice-ninja/triggers' },
            { text: 'Actions', link: '/apps/invoice-ninja/actions' },
            { text: 'Connection', link: '/apps/invoice-ninja/connection' },
          ],
        },
        {
          text: 'Mattermost',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/mattermost/actions' },
            { text: 'Connection', link: '/apps/mattermost/connection' },
          ],
        },
        {
          text: 'Miro',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/miro/actions' },
            { text: 'Connection', link: '/apps/miro/connection' },
          ],
        },
        {
          text: 'Notion',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/notion/triggers' },
            { text: 'Actions', link: '/apps/notion/actions' },
            { text: 'Connection', link: '/apps/notion/connection' },
          ],
        },
        {
          text: 'Ntfy',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/ntfy/actions' },
            { text: 'Connection', link: '/apps/ntfy/connection' },
          ],
        },
        {
          text: 'Odoo',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/odoo/actions' },
            { text: 'Connection', link: '/apps/odoo/connection' },
          ],
        },
        {
          text: 'OpenAI',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/openai/actions' },
            { text: 'Connection', link: '/apps/openai/connection' },
          ],
        },
        {
          text: 'Pipedrive',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/pipedrive/triggers' },
            { text: 'Actions', link: '/apps/pipedrive/actions' },
            { text: 'Connection', link: '/apps/pipedrive/connection' },
          ],
        },
        {
          text: 'Placetel',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/placetel/triggers' },
            { text: 'Connection', link: '/apps/placetel/connection' },
          ],
        },
        {
          text: 'PostgreSQL',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/postgresql/actions' },
            { text: 'Connection', link: '/apps/postgresql/connection' },
          ],
        },
        {
          text: 'Pushover',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/pushover/actions' },
            { text: 'Connection', link: '/apps/pushover/connection' },
          ],
        },
        {
          text: 'Reddit',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/reddit/triggers' },
            { text: 'Actions', link: '/apps/reddit/actions' },
            { text: 'Connection', link: '/apps/reddit/connection' },
          ],
        },
        {
          text: 'Remove.bg',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/removebg/actions' },
            { text: 'Connection', link: '/apps/removebg/connection' },
          ],
        },
        {
          text: 'RSS',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/rss/triggers' },
            { text: 'Connection', link: '/apps/rss/connection' },
          ],
        },
        {
          text: 'Salesforce',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/salesforce/triggers' },
            { text: 'Actions', link: '/apps/salesforce/actions' },
            { text: 'Connection', link: '/apps/salesforce/connection' },
          ],
        },
        {
          text: 'Scheduler',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/scheduler/triggers' },
            { text: 'Connection', link: '/apps/scheduler/connection' },
          ],
        },
        {
          text: 'SignalWire',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/signalwire/triggers' },
            { text: 'Actions', link: '/apps/signalwire/actions' },
            { text: 'Connection', link: '/apps/signalwire/connection' },
          ],
        },
        {
          text: 'Slack',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/slack/actions' },
            { text: 'Connection', link: '/apps/slack/connection' },
          ],
        },
        {
          text: 'SMTP',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/smtp/actions' },
            { text: 'Connection', link: '/apps/smtp/connection' },
          ],
        },
        {
          text: 'Spotify',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/spotify/actions' },
            { text: 'Connection', link: '/apps/spotify/connection' },
          ],
        },
        {
          text: 'Strava',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/strava/actions' },
            { text: 'Connection', link: '/apps/strava/connection' },
          ],
        },
        {
          text: 'Stripe',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/stripe/triggers' },
            { text: 'Connection', link: '/apps/stripe/connection' },
          ],
        },
        {
          text: 'Telegram',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/telegram-bot/actions' },
            { text: 'Connection', link: '/apps/telegram-bot/connection' },
          ],
        },
        {
          text: 'Todoist',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/todoist/triggers' },
            { text: 'Actions', link: '/apps/todoist/actions' },
            { text: 'Connection', link: '/apps/todoist/connection' },
          ],
        },
        {
          text: 'Trello',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/trello/actions' },
            { text: 'Connection', link: '/apps/trello/connection' },
          ],
        },
        {
          text: 'Twilio',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/twilio/triggers' },
            { text: 'Actions', link: '/apps/twilio/actions' },
            { text: 'Connection', link: '/apps/twilio/connection' },
          ],
        },
        {
          text: 'Twitter',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/twitter/triggers' },
            { text: 'Actions', link: '/apps/twitter/actions' },
            { text: 'Connection', link: '/apps/twitter/connection' },
          ],
        },
        {
          text: 'Typeform',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/typeform/triggers' },
            { text: 'Connection', link: '/apps/typeform/connection' },
          ],
        },
        {
          text: 'Vtiger CRM',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/vtiger-crm/triggers' },
            { text: 'Actions', link: '/apps/vtiger-crm/actions' },
            { text: 'Connection', link: '/apps/vtiger-crm/connection' },
          ],
        },
        {
          text: 'Webhooks',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/webhooks/triggers' },
            { text: 'Connection', link: '/apps/webhooks/connection' },
          ],
        },
        {
          text: 'WordPress',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/wordpress/triggers' },
            { text: 'Connection', link: '/apps/wordpress/connection' },
          ],
        },
        {
          text: 'Xero',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/xero/triggers' },
            { text: 'Connection', link: '/apps/xero/connection' },
          ],
        },
        {
          text: 'You Need A Budget',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/you-need-a-budget/triggers' },
            { text: 'Connection', link: '/apps/you-need-a-budget/connection' },
          ],
        },
        {
          text: 'Youtube',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Triggers', link: '/apps/youtube/triggers' },
            { text: 'Connection', link: '/apps/youtube/connection' },
          ],
        },
        {
          text: 'Zendesk',
          collapsible: true,
          collapsed: true,
          items: [
            { text: 'Actions', link: '/apps/zendesk/actions' },
            { text: 'Connection', link: '/apps/zendesk/connection' },
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
          text: 'Contributing',
          collapsible: true,
          items: [
            {
              text: 'Contribution guide',
              link: '/contributing/contribution-guide',
            },
            {
              text: 'Development setup',
              link: '/contributing/development-setup',
            },
            {
              text: 'Repository structure',
              link: '/contributing/repository-structure',
            },
          ],
        },
        {
          text: 'Build Integrations',
          collapsible: true,
          items: [
            {
              text: 'Folder structure',
              link: '/build-integrations/folder-structure',
            },
            {
              text: 'App',
              link: '/build-integrations/app',
            },
            {
              text: 'Global variable',
              link: '/build-integrations/global-variable',
            },
            {
              text: 'Auth',
              link: '/build-integrations/auth',
            },
            {
              text: 'Triggers',
              link: '/build-integrations/triggers',
            },
            {
              text: 'Actions',
              link: '/build-integrations/actions',
            },
            {
              text: 'Examples',
              link: '/build-integrations/examples',
            },
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
    console.log('File path: ', ctx.pageData.relativePath);
    console.log('Canonical URL: ', canonicalUrl);

    return [
      [
        'link',
        {
          rel: 'canonical',
          href: canonicalUrl,
        },
      ],
      [
        'script',
        {
          defer: true,
          'data-domain': 'automatisch.io',
          'data-api': 'https://automatisch.io/data/api/event',
          src: 'https://automatisch.io/data/js/script.js',
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
