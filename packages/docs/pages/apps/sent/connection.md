# Sent

:::info
This page explains the steps you need to follow to set up the Sent connection in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Sign in to the [Sent dashboard](https://app.sent.dm).
2. Open **Development → API Keys** and click **Add API Key**.
3. Name the key (for example `automatisch`) and click **Create Key**.
4. Copy the key and paste it into the **API Key** field on the Automatisch connection creation page. The key is shown only once in Sent.
5. Click **Submit** button on Automatisch.
6. Now you can start using the new Sent connection!

## Notes

- Automatisch verifies the key by calling Sent's account endpoint and names the connection after the account (`Account name - email`).
- The API key is stored encrypted and is only ever sent to `https://api.sent.dm`.
- If your Sent account is an **organization**, every action and trigger has an optional **Sender Profile** field to act on behalf of one of your sender profiles. Leave it empty on regular accounts.
- Sent's **sandbox** mode is a per-request option of the Send message action; it does not require a separate key.
- To rotate the API key, use **Reconnect** on the connection. Published flows keep working because reconnecting keeps the webhook signing secrets Automatisch stores for them.
