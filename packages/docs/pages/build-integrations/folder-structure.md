# Folder Structure

:::info

The build integrations section is best understood when read from beginning to end. To get the most value out of it, start from the first page and read through page by page.

1. [<mark>Folder structure</mark>](/build-integrations/folder-structure)
2. [App](/build-integrations/app)
3. [Global variable](/build-integrations/global-variable)
4. [Auth](/build-integrations/auth)
5. [Triggers](/build-integrations/triggers)
6. [Actions](/build-integrations/actions)
7. [Examples](/build-integrations/examples)

:::

:::warning
If you still need to set up the development environment, please go back to the [development setup](/contributing/development-setup) page and follow the instructions.
:::

:::tip
We will use the terms **integration** and **app** interchangeably in the documentation.
:::

Before diving into how to build an integration for Automatisch, it's better to check the folder structure of the apps and give you some idea about how we place different parts of the app.

## Folder structure of an app

Here, you can see the folder structure of an example app. We will briefly walk through the folders, explain what they are used for, and dive into the details in the following pages.

```
.
├── actions
├── assets
├── auth
├── common
├── dynamic-data
├── index.ts
└── triggers
```

## App

The `index.ts` file is the entry point of the app. It contains the definition of the app and the app's metadata. It also includes the list of triggers, actions, and data sources that the app provides. So, whatever you build inside the app, you need to associate it within the `index.ts` file.

## Auth

We ask users to authenticate with their third-party service accounts (we also document how they can accomplish this for each app.), and we store the encrypted credentials in our database. Later on, we use the credentials to make requests to the third-party service when we use them within triggers and actions. Auth folder is responsible for getting those credentials and saving them as connections for later use.

## Triggers

Triggers are the starting points of the flows. The first step in the flow always has to be a trigger. Triggers are responsible for fetching data from the third-party service and sending it to the next steps of the flow, which are actions.

## Actions

As mentioned above, actions are the steps we place after a trigger. Actions are responsible for getting data from their previous steps and taking action with that data. For example, when a new issue is created in GitHub, which is working with a trigger, we can send a message to the Slack channel, which will happen with an action from the Slack application.

## Common

The common folder is where you can put utilities or shared functionality used by other folders like triggers, actions, auth, etc.

## Dynamic data

Sometimes you need to get some dynamic data with the user interface to set up the triggers or actions. For example, to use the new issues trigger from the GitHub app, we need to select the repository we want to track for the new issues. This selection should load the repository list from GitHub. This is where the data folder comes into play. You can put your data fetching logic here when it doesn't belong to triggers or actions but is used to set up triggers or actions in the Automatisch user interface.

## Assets

It is the folder we designed to put the app's static files, but currently we support serving only the `favicon.svg` file from the folder.
