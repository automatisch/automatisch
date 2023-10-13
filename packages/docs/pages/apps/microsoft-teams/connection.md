# Microsoft Teams

:::info
This page explains the steps you need to follow to set up the Microsoft Teams
connection in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Sign in to the [Microsoft Entra admin center](https://entra.microsoft.com).
2. Click **Identity** from the menu on the left.
3. Expand the **Applications** and click **App Registrations**.
4. In this page, click on **New registrations**.
5. Fill in the **Name** field.
6. Select the **Accounts in any organizational directory** option.
7. In Redirect URI, select **Web** as platform.
8. Copy **OAuth Redirect URL** from Automatisch to the **Redirect URI** field.
9. Click on the **Register** button at the end of the form.
10. Go to the **Authentication** tab and select **Access tokens (used for implicit flows)** in the **Implicit grant and hybrid flows** section.
11. Click on the **Save** button.
12. Go to the **Overview** tab.
13. Copy the **Application (client) ID** value to the `Client ID` field on Automatisch.
14. In the same page, click on the **Add a certificate or secret** link.
15. Click on the **New client secret** button.
16. Fill in the **Description**, **Expires**, **Start**, and **End** fields.
17. It is important to note that you need to reconnect your connection manually once the client secret expires.
18. and click on the **Add** button.
19. Copy the **Client Secret** value to the `Client Secret` field on Automatisch.
20. Click **Submit** button on Automatisch.
21. Congrats! Start using your new Microsoft Teams connection within the flows.
