# App

:::info

The build integrations section is best understood when read from beginning to end. To get the most value out of it, start from the first page and read through page by page.

1. [Folder structure](/build-integrations/folder-structure)
2. [<mark>App</mark>](/build-integrations/app)
3. [Global variable](/build-integrations/global-variable)
4. [Auth](/build-integrations/auth)
5. [Triggers](/build-integrations/triggers)
6. [Actions](/build-integrations/actions)
7. [Examples](/build-integrations/examples)

:::

Let's start building our first app by using [TheCatApi](https://thecatapi.com/) service. It's a service that provides cat images and allows you to vote or favorite a specific cat image. It's an excellent example to demonstrate how Automatisch works with an API that has authentication and data fetching with pagination.

We will build an app with the `Search cat images` trigger and `Mark the cat image as favorite` action. So we will learn how to build both triggers and actions.

## Define the app

The first thing we need to do is to create a folder inside of the apps in the backend package.

```bash
cd packages/backend/src/apps
mkdir thecatapi
```

We need to create an `index.ts` file inside of the `thecatapi` folder.

```bash
cd thecatapi
touch index.ts
```

Then let's define the app inside of the `index.ts` file as follows:

```typescript
import defineApp from '../../helpers/define-app';

export default defineApp({
  name: 'The cat API',
  key: 'thecatapi',
  iconUrl: '{BASE_URL}/apps/thecatapi/assets/favicon.svg',
  authDocUrl: 'https://automatisch.io/docs/apps/thecatapi/connection',
  supportsConnections: true,
  baseUrl: 'https://thecatapi.com',
  apiBaseUrl: 'https://api.thecatapi.com',
  primaryColor: '000000',
});
```

- `name` is the displayed name of the app in Automatisch.
- `key` is the unique key of the app. It's used to identify the app in Automatisch.
- `iconUrl` is the URL of the app icon. It's used in Automatisch to display the app icon. You can use `{BASE_URL}` placeholder to refer to the base URL of the app. We expect you to place the SVG icon as `assets/favicon.svg` file.
- `authDocUrl` is the URL of the documentation page that describes how to connect to the app. It's used in Automatisch to display the documentation link on the connection page.
- `supportsConnections` is a boolean that indicates whether the app supports connections or not. If it's `true`, Automatisch will display the connection page for the app. Some apps like RSS and Scheduler do not support connections since they do not have authentication.
- `baseUrl` is the base URL of the third-party service.
- `apiBaseUrl` is the API URL of the third-party service.
- `primaryColor` is the primary color of the app. It's used in Automatisch to generate the app icon if it does not provide an icon. You can put any hex color code that reflects the branding of the third-party service.

## Create the favicon

Even though we have defined the `iconUrl` inside the app definition, we still need to create the icon file. Let's create the `assets` folder inside the `thecatapi` folder and save [this SVG file](../public/example-app/cat.svg) as `favicon.svg` inside of the `assets` folder.

:::tip
If you're looking for SVG icons for third-party services, you can use the following repositories.

- [gilbarbara/logos](https://github.com/gilbarbara/logos)
- [edent/SuperTinyIcons](https://github.com/edent/SuperTinyIcons)

:::

## Test the app definition

Now, you can go to the `My Apps` page on Automatisch and click on `Add connection` button, and then you will see `The cat API` service with the icon.
