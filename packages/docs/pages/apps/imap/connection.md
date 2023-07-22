# IMAP

:::info
This page explains the steps you need to follow to set up the IMAP
connection in Automatisch. If any of the steps are outdated, please let us know!
:::

To create a connection, you need to supply the following information:

1. Fill the **Host Name** field with the IMAP host.
2. Fill the **Email** field with the IMAP email.
3. Fill the **Password** field with the IMAP email account's password.
4. Fill the **sslHostname** hostname that matches the SSL certificate. Defaults to the host field, isn't needed for non TLS connections.

There may be some trouble syncing emails when the IMAP server and Authomatisch server are in different timezones (dates). It would be ideal
if both servers were in the same timezone. 
