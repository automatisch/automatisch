# Google Tasks

:::info
This page explains the steps you need to follow to set up the Google Tasks
connection in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Go to the [Google Cloud Console](https://console.cloud.google.com) to create a project.
2. Click on the project drop-down menu at the top of the page, and click on the **New Project** button.
3. Enter a name for your project and click on the **Create** button.
4. Go to [API Library](https://console.cloud.google.com/apis/library) in Google Cloud console.
5. Search for **Google Tasks API** in the search bar and click on it.
6. Click on the **Enable** button to enable the API.
7. Repeat steps 5 and 6 for the **People API**.
8. Go to [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent) in Google Cloud console.
9. Select **External** here for starting your app in testing mode at first. Click on the **Create** button.
10. Fill **App Name**, **User Support Email**, and **Developer Contact Information**. Click on the **Save and Continue** button.
11. Skip adding or removing scopes and click on the **Save and Continue** button.
12. Click on the **Add Users** button and add a test email because only test users can access the app while publishing status is set to "Testing".
13. Click on the **Save and Continue** button and now you have configured the consent screen.
14. Go to [Credentials](https://console.cloud.google.com/apis/credentials) in Google Cloud console.
15. Click on the **Create Credentials** button and select the **OAuth client ID** option.
16. Select the application type as **Web application** and fill the **Name** field.
17. Copy **OAuth Redirect URL** from Automatisch to **Authorized redirect URIs** field, and click on the **Create** button.
18. Copy the **Your Client ID** value from the following popup to the `Client ID` field on Automatisch.
19. Copy the **Your Client Secret** value from the following popup to the `Client Secret` field on Automatisch.
20. Click **Submit** button on Automatisch.
21. Congrats! Start using your new Google Tasks connection within the flows.
