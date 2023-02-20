# Configuration

## How to set environment variables?

You can modify the `docker-compose.yml` file to override environment variables. Please do not forget to change in `main` and `worker` services of docker-compose since the following variables might be used in both.

## Environment Variables

:::warning
The default values for some environment variables might be different in our development setup but following table shows the default values for docker-compose setup, which is the recommended way to run the application.
:::

:::danger
Please be careful with the `ENCRYPTION_KEY` and `WEBHOOK_SECRET_KEY` environment variables. They are used to encrypt your credentials from third-party services and verify webhook requests. If you change them, your existing connections and flows will not continue to work.
:::

| Variable Name               | Type    | Default Value      | Description                                          |
| --------------------------- | ------- | ------------------ | ---------------------------------------------------- |
| `PORT`                      | string  | `3000`             | HTTP Port                                            |
| `APP_ENV`                   | string  | `production`       | Automatisch Environment                              |
| `WEB_APP_URL`               | string  |                    | Can be used to override connection URLs and CORS URL |
| `WEBHOOK_URL`               | string  |                    | Can be used to override webhook URL                  |
| `POSTGRES_DATABASE`         | string  | `automatisch`      | Database Name                                        |
| `POSTGRES_PORT`             | number  | `5432`             | Database Port                                        |
| `POSTGRES_HOST`             | string  | `postgres`         | Database Host                                        |
| `POSTGRES_USERNAME`         | string  | `automatisch_user` | Database User                                        |
| `POSTGRES_PASSWORD`         | string  |                    | Password of Database User                            |
| `ENCRYPTION_KEY`            | string  |                    | Encryption Key to store credentials                  |
| `WEBHOOK_SECRET_KEY`        | string  |                    | Webhook Secret Key to verify webhook requests        |
| `APP_SECRET_KEY`            | string  |                    | Secret Key to authenticate the user                  |
| `REDIS_HOST`                | string  | `redis`            | Redis Host                                           |
| `REDIS_PORT`                | number  | `6379`             | Redis Port                                           |
| `REDIS_USERNAME`            | string  |                    | Redis Username                                       |
| `REDIS_PASSWORD`            | string  |                    | Redis Password                                       |
| `REDIS_TLS`                 | boolean | `false`            | Redis TLS                                            |
| `TELEMETRY_ENABLED`         | boolean | `true`             | Enable/Disable Telemetry                             |
| `ENABLE_BULLMQ_DASHBOARD`   | boolean | `false`            | Enable BullMQ Dashboard                              |
| `BULLMQ_DASHBOARD_USERNAME` | string  |                    | Username to login BullMQ Dashboard                   |
| `BULLMQ_DASHBOARD_PASSWORD` | string  |                    | Password to login BullMQ Dashboard                   |
