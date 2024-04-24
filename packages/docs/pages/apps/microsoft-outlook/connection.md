# Microsoft Outlook

:::info
This page explains the steps you need to follow to register an application in Microsoft Entra
for integrating Microsoft Outlook in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Navigate to the Microsoft Entra admin center at https://entra.microsoft.com/.
    - You can find detailed instructions about how to register your application
      at https://learn.microsoft.com/en-us/graph/auth-register-app-v2.
2. Select **Azure Active Directory** from the left-hand navigation menu.
3. Under **Manage**, click on **App registrations**.
4. Click on **New registration** at the top of the page.
5. Enter a **Name** for your application to identify it (e.g., Automatisch Outlook Integration).
6. Specify the **Supported account types** (e.g., Accounts in this organizational directory only).
7. Select Web as the **Redirect URI** type and enter the **OAuth Redirect URL**.
    - You can find the **OAuth Redirect URL** in the Automatisch Microsoft Outlook connection settings.
8. Click on the **Register** button at the bottom of the form.
9. Once the app is registered, navigate to the **Overview** section:
    - Copy the **Application (client) ID** and paste it into the `Client ID` field on Automatisch.
    - Copy the **Directory (tenant) ID** and paste it into the `Tenant ID` field on Automatisch.
10. Under **Certificates & secrets**, click on **New client secret**. Add a description and set an expiry period, then
    click **Add**.
11. Copy the **Value** of the newly created client secret and paste it into the `Client Secret` field on Automatisch.
12. Click **Done** on the Microsoft Entra page.
13. Click **Submit** on Automatisch.
14. Congrats! You are now ready to start using your new Microsoft Outlook integration within Automatisch flows.

