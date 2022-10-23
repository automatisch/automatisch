# Telemetry

:::info
We want to be very transparent about the data we collect and how we use it. Therefore, we have abstracted all of the code we use with our telemetry system into a single, easily accessible place. You can check the code [here](https://github.com/automatisch/automatisch/blob/main/packages/backend/src/helpers/telemetry/index.ts) and let us know if you have any suggestions for changes.
:::

Automatisch comes with a built-in telemetry system that collects anonymous usage data. This data is used to help us improve the product and to make sure we are focusing on the right features. While we're doing it, we don't collect any personal information. You can also disable the telemetry system by setting the `TELEMETRY_ENABLED` environment variable. See the [environment variables](/advanced/configuration#environment-variables) section for more information.

## What Automatisch collects?

- Flow, step, and connection data without any credentials.
- Execution and execution steps data without any payload or identifiable information.
- Organization and instance IDs. Those are random IDs we assign when you install Automatisch. They're helpful when we evaluate how many instances are running and how many organizations are using Automatisch.
- Diagnostic information
  - Automatisch version
  - Service type (main service or worker service)
  - Operating system type and version
  - CPU and memory information

## What Automatisch do not collect?

- Personal information
- Your credentials of third party services
- Email and password used with Automatisch
- Error payloads

## How to disable telemetry?

Telemetry is enabled by default. If you want to disable it, you can do so by setting the `TELEMETRY_ENABLED` environment variable to `false` in `docker-compose.yml` file.

## How data collection works?

Automatisch collects data with events associated with custom user actions. We send the data to our servers whenever the user triggers those custom actions. Apart from events that are triggered by user actions, we also collect diagnostic information every six hours.
