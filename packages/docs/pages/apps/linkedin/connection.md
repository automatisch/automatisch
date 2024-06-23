# Eventbrite

:::info
This page explains the steps you need to follow to set up the Eventbrite connection in Automatisch. If any of the steps are outdated, please let us know!
:::

# How to Create an Eventbrite App to Get a Client ID and Client Secret

To create an Eventbrite app and obtain a client ID and client secret, follow these steps:

## Step 1: Log In to Eventbrite
1. Visit the Eventbrite website: [Eventbrite](https://www.eventbrite.com)
1. Log in with your Eventbrite account. If you don't have an account, you will need to create one.

## Step 2: Access the Eventbrite Developer Portal
1. Once logged in, go to the Eventbrite Developer Portal: [Eventbrite Developer Portal](https://www.eventbrite.com/platform)
1. Click on the "Get Started" button or navigate to the "My Apps" section.

## Step 3: Create a New App
1. In the "My Apps" section, click the "Create App" button.
1. Fill out the required information:
    - **App Name**: Enter a name for your app.
    - **App Description**: Provide a brief description of your app.
    - **Redirect URI**: This is the **OAuth Redirect URL** from Automatisch.

## Step 4: Configure App Permissions
1. Under the "Permissions" section, select the necessary scopes for your app. These scopes define the level of access your app will have to the Eventbrite API.
1. Select the appropriate permissions based on the functionalities your app requires.

## Step 5: Save Your App
1. Once you've filled out all the required information and selected the necessary permissions, click the "Save" button.
1. Your app will be created, and you will be redirected to the app details page.

## Step 6: Configure Automatisch
1. On the app details page, you will see your **Client ID** and **Client Secret**.
1. Copy your **Client ID** and **Client Secret** into the corresponding fields on Auutomatisch.
1. Enter a memorable name for your connection in the **Screen Name** field.
1. Click the **Submit** button on Automatisch.
1. Congrats! Start using your new Eventbrite connection within the flows.

## Additional Resources
- Eventbrite API Documentation: [Eventbrite API](https://www.eventbrite.com/platform/api)
- OAuth Authentication Guide: [Eventbrite OAuth Guide](https://www.eventbrite.com/platform/api#/introduction/authentication/oauth)
