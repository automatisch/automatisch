# Installation

:::tip

You can use `user@automatisch.io` email address and `sample` password to login to Automatisch. Please do not forget to change your email and password from the settings page.

:::

:::danger
Please be careful with the `ENCRYPTION_KEY` and `WEBHOOK_SECRET_KEY` environment variables. They are used to encrypt your credentials from third-party services and verify webhook requests. If you change them, your existing connections and flows will not continue to work.
:::

## Docker Compose

```bash
# Clone the repository
git clone git@github.com:automatisch/automatisch.git

# Go to the repository folder
cd automatisch

# Start
docker compose up
```

✌️ That's it; you have Automatisch running. Let's check it out by browsing [http://localhost:3000](https://localhost:3000)

## Docker

Automatisch comes with two services which are `main` and `worker`. They both use the same image and need to have the same environment variables except for the `WORKER` environment variable which is set to `true` for the worker service.

::: warning
We give the sample environment variable files for the setup but you should adjust them to include your own values.
:::

To run the main:

```bash
docker run --env-file=./.env automatischio/automatisch
```

To run the worker:

```bash
docker run --env-file=./.env -e WORKER=true automatischio/automatisch
```

::: details .env

```bash
APP_ENV=production
HOST=
PROTOCOL=
PORT=
ENCRYPTION_KEY=
WEBHOOK_SECRET_KEY=
APP_SECRET_KEY=
POSTGRES_HOST=
POSTGRES_PORT=
POSTGRES_DATABASE=
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_ENABLE_SSL=
REDIS_HOST=
REDIS_PORT=
REDIS_USERNAME=
REDIS_PASSWORD=
REDIS_TLS=
```

:::

## Production setup

If you need to change any other environment variables for your production setup, let's check out the [environment variables](/advanced/configuration#environment-variables) section of the configuration page.

## Let's discover!

If you see any problems while installing Automatisch, let us know via [github issues](https://github.com/automatisch/automatisch/issues) or our [discord server](https://discord.gg/dJSah9CVrC).
