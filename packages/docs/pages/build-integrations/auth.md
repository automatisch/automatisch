# Auth

:::info

The build integrations section is best understood when read from beginning to end. To get the most value out of it, start from the first page and read through page by page.

1. [Folder structure](/build-integrations/folder-structure)
2. [App](/build-integrations/app)
3. [Global variable](/build-integrations/global-variable)
4. [<mark>Auth</mark>](/build-integrations/auth)
5. [Triggers](/build-integrations/triggers)
6. [Actions](/build-integrations/actions)
7. [Examples](/build-integrations/examples)

:::

## Sign up for the cat API

Go to the [sign up page](https://thecatapi.com/signup) of the cat API and register your account. It allows you to have 10k requests per month with a free account. You will get an API key by email after the registration. We will use this API key for authentication later on.

## The cat API docs

You can find detailed documentation of the cat API [here](https://docs.thecatapi.com). You need to revisit this page while building the integration.

## Add auth to the app

Open the `thecatapi/index.ts` file and add the highlighted lines for authentication.

```typescript{2,13}
import defineApp from '../../helpers/define-app';
import auth from './auth';

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
});
```

## Define auth fields

Let's create the `auth/index.ts` file inside of the `thecatapi` folder.

```bash
mkdir auth
touch auth/index.ts
```

Then let's start with defining fields the auth inside of the `auth/index.ts` file as follows:

```typescript
export default {
  fields: [
    {
      key: 'screenName',
      label: 'Screen Name',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description:
        'Screen name of your connection to be used on Automatisch UI.',
      clickToCopy: false,
    },
    {
      key: 'apiKey',
      label: 'API Key',
      type: 'string' as const,
      required: true,
      readOnly: false,
      value: null,
      placeholder: null,
      description: 'API key of the cat API service.',
      clickToCopy: false,
    },
  ],
};
```

We have defined two fields for the auth.

- The `apiKey` field will be used to authenticate the requests to the cat API.
- The `screenName` field will be used to identify the connection on the Automatisch UI.

:::warning
You have to add a screen name field in case there is no API endpoint where you can get the username or any other information about the user that you can use as a screen name. Some of the APIs have an endpoint for this purpose like `/me` or `/users/me`, but in our example, the cat API doesn't have such an endpoint.
:::

:::danger
If the third-party service you use provides both an API key and OAuth for the authentication, we expect you to use OAuth instead of an API key. Please consider that when you create a pull request for a new integration. Otherwise, we might ask you to have changes to use OAuth. To see apps with OAuth implementation, you can check [examples](/build-integrations/examples#_3-legged-oauth).
:::

## Verify credentials

So until now, we integrated auth folder with the app definition and defined the auth fields. Now we need to verify the credentials that the user entered. We will do that by defining the `verifyCredentials` method.

Start with adding the `verifyCredentials` method to the `auth/index.ts` file.

```typescript{1,8}
import verifyCredentials from './verify-credentials';

export default {
  fields: [
    // ...
  ],

  verifyCredentials,
};
```

Let's create the `verify-credentials.ts` file inside the `auth` folder.

```typescript
import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  // TODO: Implement verification of the credentials
};

export default verifyCredentials;
```

We generally use the `users/me` endpoint or any other endpoint that we can validate the API key or any other credentials that the user provides. For our example, we don't have a specific API endpoint to check whether the credentials are correct or not. So we will randomly pick one of the API endpoints, which will be the `GET /v1/images/search` endpoint. We will send a request to this endpoint with the API key. If the API key is correct, we will get a response from the API. If the API key is incorrect, we will get an error response from the API.

Let's implement the authentication logic that we mentioned above in the `verify-credentials.ts` file.

```typescript
import { IGlobalVariable } from '@automatisch/types';

const verifyCredentials = async ($: IGlobalVariable) => {
  await $.http.get('/v1/images/search');

  await $.auth.set({
    screenName: $.auth.data.screenName,
  });
};

export default verifyCredentials;
```

Here we send a request to the `/v1/images/search` endpoint with the API key. If we get a response from the API, we will set the screen name to the auth data. If we get an error response from the API, it will throw an error.

:::warning
You must always provide a `screenName` field to auth data in the `verifyCredentials` method. Otherwise, the connection will not have a name and it will not function properly in the user interface.
:::

## Is still verified?

We have implemented the `verifyCredentials` method. Now we need to check whether the credentials are still valid or not for the test connection functionality in Automatisch. We will do that by defining the `isStillVerified` method.

Start with adding the `isStillVerified` method to the `auth/index.ts` file.

```typescript{2,10}
import verifyCredentials from './verify-credentials';
import isStillVerified from './is-still-verified';

export default {
  fields: [
    // ...
  ],

  verifyCredentials,
  isStillVerified,
};
```

Let's create the `is-still-verified.ts` file inside the `auth` folder.

```typescript
import { IGlobalVariable } from '@automatisch/types';
import verifyCredentials from './verify-credentials';

const isStillVerified = async ($: IGlobalVariable) => {
  await verifyCredentials($);
  return true;
};

export default isStillVerified;
```

:::info
`isStillVerified` method needs to return the `truthy` value if the credentials are still valid.
:::

We will use the `verifyCredentials` method to check whether the credentials are still valid or not. If the credentials are still valid, we will return `true`. Otherwise, it will throw an error which will automatically be handled by Automatisch.

:::warning
You might be wondering why we need to have two separate functions even though we use only one of them behind the scenes in this scenario. That might be true in our example or any other APIs similar to the cat API but there are some other third-party APIs that we can't use the same functionality directly to check whether the credentials are still valid or not. So we need to have two separate functions for verifying the credentials and checking whether the credentials are still valid or not.
:::

:::tip
If your integration requires you to connect through the authorization URL of the third-party service, you need to use the `generateAuthUrl` method together with the `verifyCredentials` and the `isStillVerified` methods. Check [3-legged OAuth](/build-integrations/examples#_3-legged-oauth) examples to see how to implement them.
:::

## Test the authentication

Now we have completed the authentication of the cat API. Go to the `My Apps` page in Automatisch, try to add a new connection, select `The Cat API` and use the `API Key` you got with an email. Then you can also check the test connection and reconnect functionality there.

Let's move on to the next page to build a trigger.
