# Frappe / ERPNext

:::info
This page explains the steps you need to follow to set up the Frappe / ERPNext
connection in Automatisch. If any of the steps are outdated, please let us know!
:::

1. Setup a new `OAuth Client` on your Frappe / ERPNext instance by following [this guide](https://docs.frappe.io/framework/user/en/guides/integration/how_to_set_up_oauth#add-a-client-app). Copy **OAuth Redirect URL** from Automatisch to **Redirect URIs** and **Default Redirect URI** fields in Frappe's OAuth Client document.
2. Set your Site URL in the Automatisch connection dialog.
3. Copy the **Client ID** and **Client Secret** values from the above document to the `Client ID` and `Client Secret` fields on Automatisch.
4. Click **Submit** button on Automatisch.
