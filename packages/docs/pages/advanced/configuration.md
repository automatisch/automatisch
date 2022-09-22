# Configuration

## How to set environment variables?

You can modify the `docker-compose.yml` file to override environment variables. Please do not forget to change in `main` and `worker` services of docker-compose since the following variables might be used in both.

## Environment Variables

:::warning
The default values for some environment variables might be different in our development setup but following table shows the default values for docker-compose setup, which is the recommended way to run the application.
:::

| Variable Name       | Type    | Default Value      | Description                         |
| ------------------- | ------- | ------------------ | ----------------------------------- |
| `HOST`              | string  | `localhost`        | HTTP Host                           |
| `PROTOCOL`          | string  | `http`             | HTTP Protocol                       |
| `PORT`              | string  | `3000`             | HTTP Port                           |
| `APP_ENV`           | string  | `production`       | Automatisch Environment             |
| `POSTGRES_DATABASE` | string  | `automatisch`      | Database Name                       |
| `POSTGRES_PORT`     | number  | `5432`             | Database Port                       |
| `POSTGRES_HOST`     | string  | `postgres`         | Database Host                       |
| `POSTGRES_USERNAME` | string  | `automatisch_user` | Database User                       |
| `POSTGRES_PASSWORD` | string  |                    | Password of Database User           |
| `ENCRYPTION_KEY`    | string  |                    | Encryption Key to store credentials |
| `APP_SECRET_KEY`    | string  |                    | Secret Key to authenticate the user |
| `REDIS_HOST`        | string  | `redis`            | Redis Host                          |
| `REDIS_PORT`        | number  | `6379`             | Redis Port                          |
| `TELEMETRY_ENABLED` | boolean | `true`             | Enable/Disable Telemetry            |
