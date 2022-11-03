# Slack

:::info
This page explains the steps you need to follow to set up the Slack connection in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Go to the [link](https://api.slack.com/apps?new_app=1) to **create an app**
   on Slack API.
1. Select **From scratch**.
1. Enter **App name**.
1. Pick the workspace you would like to use with the Slack connection.
1. Click on **Create App** button.
1. Copy **Client ID** and **Client Secret** values and save them to use later.
1. Go to **OAuth & Permissions** page.
1. Copy **OAuth Redirect URL** from Automatisch and add it in Redirect URLs. Don't forget to save it after adding it by clicking **Save URLs** button!
1. Go to **Bot Token Scopes** and add `chat:write.customize` along with `chat:write` scope to enable the bot functionality.

:::warning HTTPS required!

Slack does **not** allow non-secure URLs in redirect URLs. Therefore, you will need to serve Automatisch via HTTPS protocol.
:::

10. Paste **Client ID** and **Client Secret** values you have saved earlier and paste them into Automatisch as **Consumer Key** and **Consumer Secret**, respectively.
1. Click **Submit** button on Automatisch.
1. Now, you can start using the Slack connection with Automatisch.
