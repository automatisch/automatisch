# Actions

## Add actions to the app.

Open the thecatapi/index.ts file and add the highlighted lines for actions.

Open the `thecatapi/index.ts` file and add the highlighted lines for triggers.

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

Let's create the `actions/index.ts` file inside of the `thecatapi` folder.

```typescript
import mark-cat-image-as-favorite from './mark-cat-image-as-favorite';

export default [markCatImageAsFavorite];
```

:::tip
If you add new actions, you need to add them to the actions/index.ts file and export all actions as an array.
:::

## Add metadata

Let's create the `actions/mark-cat-image-as-favorite.ts` file inside of the `thecatapi` folder.

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

Let's implement the action. Open the `actions/mark-cat-image-as-favorite.ts` file and add the highlighted lines.

```typescript{7-15}
import defineAction from '../../../../helpers/define-action';

export default defineAction({
  // ...

  async run($) {
    const requestPath = `/v1/favorites`;
    const imageId = $.step.parameters.imageId;

    const response = await $.http.post(
      requestPath,
      { image_id: imageId }
    );

    $.setActionItem({ raw: response.data });
  },
});
```

## Test the action

Let's go to the flows page of Automatisch and create a new flow. Add the `Search cat images` as a trigger in the flow. Add the `Mark the cat image as favorite` action to the flow as a second step. Add one of the image IDs you got from the cat API as `Image ID` argument to the action. Click `Test & Continue` button. If you a see JSON response in the user interface, it means that both the trigger and the action we built are working properly.
