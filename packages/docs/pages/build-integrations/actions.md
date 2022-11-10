# Actions

:::info

The build integrations section is best understood when read from beginning to end. To get the most value out of it, start from the first page and read through page by page.

1. [Folder structure](/build-integrations/folder-structure)
2. [App](/build-integrations/app)
3. [Global variable](/build-integrations/global-variable)
4. [Auth](/build-integrations/auth)
5. [Triggers](/build-integrations/triggers)
6. [<mark>Actions</mark>](/build-integrations/actions)
7. [Examples](/build-integrations/examples)

:::

## Add actions to the app.

Open the `thecatapi/index.ts` file and add the highlighted lines for actions.

```typescript{4,17}
import defineApp from '../../helpers/define-app';
import auth from './auth';
import triggers from './triggers';
import actions from './actions';

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
  actions
});
```

## Define actions

Create the `actions/index.ts` file inside of the `thecatapi` folder.

```typescript
import markCatImageAsFavorite from './mark-cat-image-as-favorite';

export default [markCatImageAsFavorite];
```

:::tip
If you add new actions, you need to add them to the actions/index.ts file and export all actions as an array.
:::

## Add metadata

Create the `actions/mark-cat-image-as-favorite/index.ts` file inside the `thecatapi` folder.

```typescript
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  name: 'Mark the cat image as favorite',
  key: 'markCatImageAsFavorite',
  description: 'Marks the cat image as favorite.',
  arguments: [
    {
      label: 'Image ID',
      key: 'imageId',
      type: 'string' as const,
      required: true,
      description: 'The ID of the cat image you want to mark as favorite.',
      variables: true,
    },
  ],

  async run($) {
    // TODO: Implement action!
  },
});
```

Let's briefly explain what we defined here.

- `name`: The name of the action.
- `key`: The key of the action. This is used to identify the action in Automatisch.
- `description`: The description of the action.
- `arguments`: The arguments of the action. These are the values that the user provides when using the action.
- `run`: The function that is executed when the action is executed.

## Implement the action

Open the `actions/mark-cat-image-as-favorite.ts` file and add the highlighted lines.

```typescript{7-20}
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  // ...

  async run($) {
    const requestPath = '/v1/favourites';
    const imageId = $.step.parameters.imageId;

    const headers = {
      'x-api-key': $.auth.data.apiKey as string,
    };

    const response = await $.http.post(
      requestPath,
      { image_id: imageId },
      { headers }
    );

    $.setActionItem({ raw: response.data });
  },
});
```

In this action, we send a request to the cat API to mark the cat image as favorite. We used the `$.http.post` method to send the request. The request body contains the image ID as it's required by the API.

`$.setActionItem` is used to set the result of the action, so we set the response data as the action item. This is used to display the result of the action in the Automatisch UI and can be used in the next steps of the workflow.

## Test the action

Go to the flows page of Automatisch and create a new flow. Add the `Search cat images` as a trigger in the flow. Add the `Mark the cat image as favorite` action to the flow as a second step. Add one of the image IDs you got from the cat API as `Image ID` argument to the action. Click `Test & Continue` button. If you a see JSON response in the user interface, it means that both the trigger and the action we built are working properly.
