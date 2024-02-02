# Examples

:::info

The build integrations section is best understood when read from beginning to end. To get the most value out of it, start from the first page and read through page by page.

1. [Folder structure](/build-integrations/folder-structure)
2. [App](/build-integrations/app)
3. [Global variable](/build-integrations/global-variable)
4. [Auth](/build-integrations/auth)
5. [Triggers](/build-integrations/triggers)
6. [Actions](/build-integrations/actions)
7. [<mark>Examples</mark>](/build-integrations/examples)

:::

## Authentication

### 3-legged OAuth

- [Discord](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/discord/auth/index.js)
- [Flickr](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/flickr/auth/index.js)
- [Github](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/github/auth/index.js)
- [Salesforce](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/salesforce/auth/index.js)
- [Slack](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/slack/auth/index.js)
- [Twitter](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/twitter/auth/index.js)

### OAuth with the refresh token

- [Salesforce](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/salesforce/auth/index.js)

### API key

- [DeepL](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/deepl/auth/index.js)
- [Twilio](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/twilio/auth/index.js)
- [SignalWire](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/signalwire/auth/index.js)
- [SMTP](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/smtp/auth/index.js)

### Without authentication

- [RSS](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/rss/index.js)
- [Scheduler](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/scheduler/index.js)

## Triggers

### Polling-based triggers

- [Search tweets - Twitter](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/twitter/triggers/search-tweets/index.js)
- [New issues - Github](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/github/triggers/new-issues/index.js)

### Webhook-based triggers

:::warning
If you are developing a webhook-based trigger, you need to ensure that the webhook is publicly accessible. You can use [ngrok](https://ngrok.com) for this purpose and override the webhook URL by setting the **WEBHOOK_URL** environment variable.
:::

- [New entry - Typeform](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/typeform/triggers/new-entry/index.js)

### Pagination with descending order

- [Search tweets - Twitter](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/twitter/triggers/search-tweets/index.js)
- [New issues - Github](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/github/triggers/new-issues/index.js)
- [Receive SMS - Twilio](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/twilio/triggers/receive-sms/index.js)
- [Receive SMS - SignalWire](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/signalwire/triggers/receive-sms/index.js)
- [New photos - Flickr](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/flickr/triggers/new-photos/index.js)

### Pagination with ascending order

- [New stargazers - Github](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/github/triggers/new-stargazers/index.js)
- [New watchers - Github](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/github/triggers/new-watchers/index.js)

## Actions

- [Send a message to channel - Slack](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/slack/actions/send-a-message-to-channel/index.js)
- [Send SMS - Twilio](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/twilio/actions/send-sms/index.js)
- [Send a message to channel - Discord](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/discord/actions/send-message-to-channel/index.js)
- [Create issue - Github](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/github/actions/create-issue/index.js)
- [Send an email - SMTP](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/smtp/actions/send-email/index.js)
- [Create tweet - Twitter](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/twitter/actions/create-tweet/index.js)
- [Translate text - DeepL](https://github.com/automatisch/automatisch/tree/main/packages/backend/src/apps/deepl/actions/translate-text/index.js)
