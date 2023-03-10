import { Express } from 'express';
import * as Sentry from '@sentry/node';
import type { CaptureContext } from '@sentry/types';
import * as Tracing from '@sentry/tracing';

import appConfig from '../config/app';

export function init(app?: Express) {
  if (!appConfig.isCloud) return;

  return Sentry.init({
    enabled: !!appConfig.sentryDsn,
    dsn: appConfig.sentryDsn,
    integrations: [
      app && new Sentry.Integrations.Http({ tracing: true }),
      app && new Tracing.Integrations.Express({ app }),
      app && new Tracing.Integrations.GraphQL(),
    ].filter(Boolean),
    tracesSampleRate: 1.0,
  });
}


export function attachRequestHandler(app: Express) {
  if (!appConfig.isCloud) return;

  app.use(Sentry.Handlers.requestHandler());
}

export function attachTracingHandler(app: Express) {
  if (!appConfig.isCloud) return;

  app.use(Sentry.Handlers.tracingHandler());
}

export function attachErrorHandler(app: Express) {
  if (!appConfig.isCloud) return;

  app.use(Sentry.Handlers.errorHandler({
    shouldHandleError() {
      // TODO: narrow down the captured errors in time as we receive samples
      return true;
    }
  }));
}

export function captureException(exception: any, captureContext?: CaptureContext) {
  if (!appConfig.isCloud) return;

  return Sentry.captureException(exception, captureContext);
}
