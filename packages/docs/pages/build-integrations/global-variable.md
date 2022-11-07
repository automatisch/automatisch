# Global Variable

Before handling authentication and building a trigger and an action, it's better to explain the `global variable` concept in Automatisch. Automatisch provides you the global variable that you need to use with authentication, triggers, action, and basically all the stuff you will build for the integration.

The global variable is represented as `$` variable in the codebase, and it's a JSON object that contains the following properties:

## $.auth.set

```typescript
$.auth.set({
  key: 'value',
});
```

It's used to set the authentication data, and you can use this method with multiple pairs. The data will be stored in the database and can be retrieved later by using `$.auth.data` property. We use this method when we store the credentials of the third-party service. Note that Automatisch encrypts the data before storing it in the database.

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
