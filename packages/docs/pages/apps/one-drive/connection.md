# Microsoft OneDrive

:::info
This page explains the steps you need to follow to set up the Microsoft OneDrive connection in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Go to the [Azure Portal](https://portal.azure.com) and sign in with your Microsoft account.
2. In the left-hand menu, select **Azure Active Directory**, then choose **App registrations**.
3. Click on the **New registration** button.
4. Enter a name for your application (e.g., "Automatisch OneDrive Connection").
5. Under **Supported account types**, select the option that fits your needs (typically, "Accounts in any organizational directory and personal Microsoft accounts" is a good choice).
6. In the **Redirect URI** section, choose **Web** and paste the **OAuth Redirect URL** provided by Automatisch.
7. Click **Register** to create the application.
8. Once registered, go to the **Authentication** tab. Confirm that your redirect URI is correctly listed. (If needed, enable any additional settings such as public client flows.)
9. Navigate to the **API Permissions** tab.
10. Click **Add a permission** and then choose **Microsoft Graph**.
11. Select **Delegated permissions** and add the following (or other relevant) permissions:
    - **Files.ReadWrite** (for full OneDrive access)
    - **offline_access** (if you need to maintain access when the user is offline)
12. Click **Add permissions**. You may need to click on **Grant admin consent** for your organization if required.
13. Now, go to the **Certificates & secrets** tab.
14. Click **New client secret**, add a description (e.g., "Automatisch secret"), and select an appropriate expiration.
15. **Copy the client secret value immediately** – you won’t be able to see it again once you leave this page.
16. Return to the **Overview** tab and copy the **Application (client) ID**.
17. Open Automatisch and navigate to the OneDrive connection settings.
18. Paste the **Client ID** and **Client Secret** you obtained into the respective fields.
19. Click the **Submit** button in Automatisch.
20. Congrats! You’re now ready to start using your new Microsoft OneDrive connection within your flows.

Enjoy Automatisch with your new OneDrive integration, and let us know if you have any questions or feedback!
