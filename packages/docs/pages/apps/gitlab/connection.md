# Gitlab

:::info
This page explains the steps you need to follow to set up the Gitlab
connection in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Go to the [link](https://gitlab.com/-/profile/applications) to register a **new OAuth application** on Gitlab.
2. Fill application **Name**.
3. Copy **OAuth Redirect URL** from Automatisch to **Redirect URI** field on Gitlab page.
4. Mark the **Confidential** field on Gitlab page.
5. Mark the **api** and **read_user** in **Scopes** section on Gitlab page.
6. Click on the **Save application** button at the end of the form on Gitlab page.
7. Copy the **Application ID** value from the following page to the `Client ID` field on Automatisch.
8. Copy the **Secret** value from the same page to the `Client Secret` field on Automatisch.
9. Click **Continue** button on Gitlab page.
10. Click **Submit** button on Automatisch.
11. Congrats! Start using your new Github connection within the flows.
