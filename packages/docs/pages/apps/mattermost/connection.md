# Mattermost

:::info
This page explains the steps you need to follow to set up the Mattermost
connection in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Go to the `<WORKSPACE_NAME>/integrations/oauth2-apps/add` page of your Mattermost server to register a **new OAuth application**.
   - You can find details about registering new Mattermost oAuth application at https://docs.mattermost.com/integrations/cloud-oauth-2-0-applications.html#register-your-application-in-mattermost.
2. Fill in the **Display Name** field.
3. Fill in the **Description** field.
4. Fill in the **Homepage** field.
5. Copy **OAuth Redirect URL** from Automatisch to the **Callback URLs** field on Mattermost page.
6. Click on the **Save** button at the end of the form on Mattermost page.
7. Copy the **Client ID** value from the following page to the `Client ID` field on Automatisch.
8. Copy the **Client Secret** value from the same page to the `Client Secret` field on Automatisch.
9. Click **Done** button on MAttermost page.
10. Click **Submit** button on Automatisch.
11. Congrats! Start using your new Mattermost connection within the flows.
