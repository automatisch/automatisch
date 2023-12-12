# Salesforce

:::info
This page explains the steps you need to follow to set up the Salesforce
connection in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Go to your Salesforce dasboard.
1. Click on the gear icon in the top right corner and click **Setup** from the dropdown.
1. In the **Platform Tools** section of the sidebar, click **Apps** > **App Manager**.
1. Click the **New Connected App** button.
1. Enter necessary information in the form.
1. Check **Enable OAuth Settings** checkbox.
1. Copy **OAuth Redirect URL** from Automatisch and paste it to the **Callback URL** field.
1. Add any scopes you plan to use in the **Selected OAuth Scopes** section. We suggest `full` and `refresh_token, offline_access` scopes.
1. Uncheck "Require Proof Key for Code Exchange (PKCE) Extension for Supported Authorization Flows" checkbox.
1. Check "Enable Authorization Code and Credentials Flow" checkbox
1. Click on the **Save** button at the bottom of the page.
1. Acknowledge the information and click on the **Continue** button.
1. In the **API (Enable OAuth Settings)** section, click the **Manager Consumer Details** button.
1. You may be asked to verify your identity. To see the consumer key and secret, verify and proceed.
1. Copy the **Consumer Key** value from the page to the `Consumer Key` field on Automatisch.
1. Copy the **Consumer Secret** value from the page to the `Consumer Secret` field on Automatisch.
1. Click **Submit** button on Automatisch.
1. Now, you can start using the Salesforce connection with Automatisch.
