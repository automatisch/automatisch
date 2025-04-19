# Facebook

:::info
This page explains the steps you need to follow to set up the Facebook connection in Automatisch. If any of the steps are outdated, please let us know!
:::

## Setting up Facebook App

1. Go to [Facebook for Developers](https://developers.facebook.com/) and sign in with your Facebook account.
2. Click on **My Apps** in the top navigation bar.
3. Click **Create App** button.
4. Select **Business** as the app type and click **Next**.
5. Fill in the app details:
   - **App name**: Choose a name for your app (e.g., "My Automatisch App")
   - **App contact email**: Enter your email address
   - **Business account**: Select your business account if applicable
6. Click **Create App**.

## Configure App Settings

1. After creating the app, navigate to the **Settings** > **Basic** section.
2. Copy the **App ID** and **App Secret** values and save them to use later.
3. Add your app domain under **App Domains** if applicable.
4. In the left sidebar, click on **Facebook Login** > **Settings**.
5. Add the OAuth Redirect URL from Automatisch to **Valid OAuth Redirect URIs** field.
6. Click **Save Changes**.

## Add Required Permissions

1. Navigate to **App Review** > **Permissions and Features**.
2. Request the following permissions:
   - `pages_manage_posts` - Required to create posts on your Facebook pages
   - `pages_read_engagement` - Required to read your page data
   - `pages_show_list` - Required to list your Facebook pages

## Connect in Automatisch

1. In Automatisch, go to the **Connections** page and click **Add Connection**.
2. Select **Facebook** from the list of apps.
3. Enter the **App ID** and **App Secret** values you copied earlier.
4. Click **Submit** to begin the authorization process.
5. Follow the Facebook authorization process to grant your app the required permissions.
6. After successful authorization, your Facebook connection is ready to use in Automatisch.

:::tip
For security reasons, it's recommended to create a dedicated Facebook App for Automatisch rather than using an existing app.
:::
