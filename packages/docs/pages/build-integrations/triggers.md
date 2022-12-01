# Triggers

:::info

The build integrations section is best understood when read from beginning to end. To get the most value out of it, start from the first page and read through page by page.

1. [Folder structure](/build-integrations/folder-structure)
2. [App](/build-integrations/app)
3. [Global variable](/build-integrations/global-variable)
4. [Auth](/build-integrations/auth)
5. [<mark>Triggers</mark>](/build-integrations/triggers)
6. [Actions](/build-integrations/actions)
7. [Examples](/build-integrations/examples)

:::

:::warning
We used a polling-based HTTP trigger in our example but if you need to use a webhook-based trigger, you can check the [examples](/build-integrations/examples#webhook-based-triggers) page.
:::

## Add triggers to the app

Open the `thecatapi/index.ts` file and add the highlighted lines for triggers.

```typescript{3,15}
import defineApp from '../../helpers/define-app';
import auth from './auth';
import triggers from './triggers';

export default defineApp({
  name: 'The cat API',
  key: 'thecatapi',
  iconUrl: '{BASE_URL}/apps/thecatapi/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/thecatapi/connection',
  supportsConnections: true,
  baseUrl: 'https://thecatapi.com',
  apiBaseUrl: 'https://api.thecatapi.com',
  primaryColor: '000000',
  auth,
  triggers
});
```

## Define triggers

Create the `triggers/index.ts` file inside of the `thecatapi` folder.

```typescript
import searchCatImages from './search-cat-images';

export default [searchCatImages];
```

:::tip
If you add new triggers, you need to add them to the `triggers/index.ts` file and export all triggers as an array. The order of triggers in this array will be reflected in the Automatisch user interface.
:::

## Add metadata

Create the `triggers/search-cat-images/index.ts` file inside of the `thecatapi` folder.

```typescript
import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  name: 'Search cat images',
  key: 'searchCatImages',
  pollInterval: 15,
  description: 'Triggers when there is a new cat image.',

  async run($) {
    // TODO: Implement trigger!
  },
});
```

Let's briefly explain what we defined here.

- `name`: The name of the trigger.
- `key`: The key of the trigger. This is used to identify the trigger in Automatisch.
- `pollInterval`: The interval in minutes in which the trigger should be polled. Even though we allow to define `pollInterval` field, it's not used in Automatisch at the moment. Currently, the default is 15 minutes and it's not possible to change it.
- `description`: The description of the trigger.
- `run`: The function that is executed when the trigger is triggered.

## Implement the trigger

:::danger

- Automatisch expects you to push data in **reverse-chronological order** otherwise, the trigger will not work properly.
- You have to push the `unique identifier` (it can be IDs or any field that can be used to identify the data) as `internalId`. This is used to prevent duplicate data.

:::

Implement the `run` function by adding highlighted lines.

```typescript{1,7-30}
import { IJSONObject } from '@automatisch/types';
import defineTrigger from '../../../../helpers/define-trigger';

export default defineTrigger({
  // ...
  async run($) {
    let page = 0;
    let response;

    const headers = {
      'x-api-key': $.auth.data.apiKey as string,
    };

    do {
      let requestPath = `/v1/images/search?page=${page}&limit=10&order=DESC`;
      response = await $.http.get(requestPath, { headers });

      response.data.forEach((image: IJSONObject) => {
        const dataItem = {
          raw: image,
          meta: {
            internalId: image.id as string
          },
        };

        $.pushTriggerItem(dataItem);
      });

      page += 1;
    } while (response.data.length >= 10);
  },
});
```

We are using the `$.http` object to make HTTP requests. Our API is paginated, so we are making requests until we get less than 10 items, which means the last page.

We do not have to return anything from the `run` function. We are using the `$.pushTriggerItem` function to push the data to Automatisch. $.pushTriggerItem accepts an object with the following fields:

- `raw`: The raw data that you want to push to Automatisch.
- `meta`: The metadata of the data. It has to have the `internalId` field.

:::tip

`$.pushTriggerItem` is smart enough to understand if the data is already pushed to Automatisch or not. If the data is already pushed and processed, it will stop the trigger, otherwise, it will continue to fetch new data. The check is done by comparing the `internalId` field with the `internalId` field of the data that is already processed. The control of whether the data is already processed or not is scoped by the flow.

:::

:::tip

`$.pushTriggerItem` also understands whether the trigger is executed with `Test & Continue` button in the user interface or it's a trigger from a published flow. If the trigger is executed with `Test & Continue` button, it will push only one item regardless of whether we already processed the data or not and early exits the process, otherwise, it will fetch the remaining data.

:::

:::tip

Let's say the trigger started to execute. It fetched the first five pages of data from the third-party API with five different HTTP requests and you still need to get the next page but you started to get an API rate limit error. In this case, Automatisch will not lose the data that is already fetched from the first five requests. It stops the trigger when it got the error the first time but processes all previously fetched data.

:::

## Test the trigger

Go to the flows page of Automatisch and create a new flow. Choose `The cat API` app and the `Search cat images` trigger and click `Test & Continue` button. If you a see JSON response in the user interface, it means that the trigger is working properly.
