# Global Variable

:::info

The build integrations section is best understood when read from beginning to end. To get the most value out of it, start from the first page and read through page by page.

1. [Folder structure](/build-integrations/folder-structure)
2. [App](/build-integrations/app)
3. [<mark>Global variable</mark>](/build-integrations/global-variable)
4. [Auth](/build-integrations/auth)
5. [Triggers](/build-integrations/triggers)
6. [Actions](/build-integrations/actions)
7. [Examples](/build-integrations/examples)

:::

Before handling authentication and building a trigger and an action, it's better to explain the `global variable` concept in Automatisch. Automatisch provides you the global variable that you need to use with authentication, triggers, actions, and basically all the stuff you will build for the integration.

The global variable is represented as `$` variable in the codebase, and it's a JSON object that contains the following properties:

## $.auth.set

```typescript
await $.auth.set({
  key: 'value',
});
```

It's used to set the authentication data, and you can use this method with multiple pairs. The data will be stored in the database and can be retrieved later by using `$.auth.data` property. The data you set with this method will not override its current value but expands it. We use this method when we store the credentials of the third-party service. Note that Automatisch encrypts the data before storing it in the database.

## $.auth.data

```typescript
$.auth.data; // { key: 'value' }
```

It's used to retrieve the authentication data that we set with `$.auth.set()`. The data will be retrieved from the database. We use the data property with the key name when we need to get one specific value from the data object.

## $.app.baseUrl

```typescript
$.app.baseUrl; // https://thecatapi.com
```

It's used to retrieve the base URL of the app that we defined previously. In our example, it returns `https://thecatapi.com`. We use this property when we need to use the base URL of the third-party service.

## $.app.apiBaseUrl

```typescript
$.app.apiBaseUrl; // https://api.thecatapi.com
```

It's used to retrieve the API base URL of the app that we defined previously. In our example, it returns `https://api.thecatapi.com`. We use this property when we need to use the API base URL of the third-party service.

## $.app.auth.fields

```typescript
$.app.auth.fields;
```

It's used to retrieve the fields that we defined in the `auth` section of the app. We use this property when we need to get the fields of the authentication section of the app.

## $.http

It's an HTTP client to be used for making HTTP requests. It's a wrapper around the [axios](https://axios-http.com) library. We use this property when we need to make HTTP requests to the third-party service. The `apiBaseUrl` field we set up in the app will be used as the base URL for the HTTP requests. For example, to search the cat images, we can use the following code:

```typescript
await $.http.get('/v1/images/search?order=DESC', {
  headers: {
    'x-api-key': $.auth.data.apiKey,
  },
});
```

Keep in mind that the HTTP client handles the error with the status code that falls out of the range of 2xx. So, you don't need to handle the error manually. It will be processed with the error message or error payload that you can check on the execution details page in Automatisch.

## $.step.parameters

```typescript
$.step.parameters; // { key: 'value' }
```

It refers to the parameters that are set by users in the UI. We use this property when we need to get the parameters for corresponding triggers and actions. For example [Send a message to channel](https://github.com/automatisch/automatisch/blob/main/packages/backend/src/apps/slack/actions/send-a-message-to-channel/post-message.ts) action from Slack integration, we have a step parameter called `message` that we need to use in the action. We can use `$.step.parameters.message` to get the value of the message to send a message to the Slack channel.

## $.pushTriggerItem

```typescript
$.pushTriggerItem({
  raw: resourceData,
  meta: {
    id: resourceData.id,
  },
});
```

It's used to push trigger data to be processed by Automatisch. It must reflect the data that we get from the third-party service. Let's say for search tweets trigger the `resourceData` will be the JSON that represents the single tweet object.

## $.setActionItem

```typescript
$.setActionItem({
  raw: resourceData,
});
```

It's used to set the action data to be processed by Automatisch. For actions, it reflects the response data that we get from the third-party service. Let's say for create tweet action it will be the JSON that represents the response payload we get while creating a tweet.
