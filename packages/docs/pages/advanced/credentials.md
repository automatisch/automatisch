# Credentials

We need to store your credentials in order to automatically communicate with third-party services to fetch and send data when you have connections. It's the nature of our software and how automation works, but we take extra measures to keep your third-party credentials safe and secure.

Automatisch uses AES specification to encrypt and decrypt your credentials of third-party services. The Advanced Encryption Standard (AES) is a U.S. Federal Information Processing Standard (FIPS). It was selected after a 5-year process where 15 competing designs were evaluated. AES is now used worldwide to protect sensitive information.

:::danger
Please be careful with the `ENCRYPTION_KEY` environment variable. It is used to encrypt your credentials from third-party services. If you change it, you will not be able to access your connections and thus, your existing flows and connections will be useless.
:::
