# Canva
:::info
This page explains the steps you need to follow to set up the Canva
connection in Automatisch. If any of the steps are outdated, please let us know!
:::

:::warning
Important: Canva does not allow redirect URLs using 'localhost'. You must use '127.0.0.1' instead. To facilitate this, Automatisch can be started with the following environment variables:
- WEB_APP_URL=https://127.0.0.1:3001
- HOST=127.0.0.1

Make sure to set these variables before starting Automatisch to ensure proper configuration with Canva's API.
:::

1. Log in to your [Canva account](https://www.canva.com/).
2. Go to the [Canva Developers portal](https://www.canva.com/developers/).
3. Click on "Create an app" to start a new Canva Integration.
4. Fill in the required details for your app, including the name and description.
5. Copy the **OAuth Redirect URL** from Automatisch and paste it into the "Redirect URIs" field in Canva. Remember to use '127.0.0.1' instead of 'localhost' in this URL.
6. Select the necessary scopes for your integration under the "App Permissions" section.
7. Review and accept Canva's Developer Terms of Service.
8. Click on "Create app" to finalize the creation of your Canva Integration.
9. In the "API Keys" section of your newly created app, you'll find the Client ID and Client Secret.
10. Copy the **Client ID** to the **Client ID** field in Automatisch.
11. Copy the **Client Secret** to the **Client Secret** field in Automatisch.
12. Click the **Submit** button on Automatisch.
13. Congratulations! You can now start using your new Canva connection within the flows.
