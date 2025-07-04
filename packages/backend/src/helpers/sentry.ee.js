import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import appConfig from '@/config/app.js';
import objection from 'objection';
const {
  NotFoundError,
  ValidationError,
  UniqueViolationError,
  ForeignKeyViolationError,
  DataError,
} = objection;
import QuotaExceededError from '@/errors/quote-exceeded.js';
import HttpError from '@/errors/http.js';
import NotAuthorizedError from '@/errors/not-authorized.js';

const isSentryEnabled = () => {
  if (appConfig.isDev || appConfig.isTest) return false;
  return !!appConfig.sentryDsn;
};

export function init(app) {
  if (!isSentryEnabled()) return;

  return Sentry.init({
    beforeSend(event, hint) {
      if (
        hint.originalException.message === 'Not Found' ||
        hint.originalException instanceof NotFoundError
      ) {
        return null;
      }

      if (hint.originalException instanceof QuotaExceededError) {
        return null;
      }

      if (notFoundAppError(hint.originalException)) {
        return null;
      }

      if (hint.originalException instanceof ValidationError) {
        return null;
      }

      if (hint.originalException instanceof UniqueViolationError) {
        return null;
      }

      if (hint.originalException instanceof ForeignKeyViolationError) {
        return null;
      }

      if (hint.originalException instanceof DataError) {
        return null;
      }

      if (hint.originalException instanceof HttpError) {
        return null;
      }

      if (hint.originalException instanceof NotAuthorizedError) {
        return null;
      }

      return event;
    },
    enabled: !!appConfig.sentryDsn,
    dsn: appConfig.sentryDsn,
    integrations: [
      app && new Sentry.Integrations.Http({ tracing: true }),
      app && new Tracing.Integrations.Express({ app }),
    ].filter(Boolean),
    tracesSampleRate: 1.0,
  });
}

const notFoundAppError = (error) => {
  return (
    error.message.includes('An application with the') &&
    error.message.includes("key couldn't be found.")
  );
};

export function attachRequestHandler(app) {
  if (!isSentryEnabled()) return;

  app.use(Sentry.Handlers.requestHandler());
}

export function attachTracingHandler(app) {
  if (!isSentryEnabled()) return;

  app.use(Sentry.Handlers.tracingHandler());
}

export function attachErrorHandler(app) {
  if (!isSentryEnabled()) return;

  app.use(
    Sentry.Handlers.errorHandler({
      shouldHandleError() {
        // TODO: narrow down the captured errors in time as we receive samples
        return true;
      },
    })
  );
}

export function captureException(exception, captureContext) {
  if (!isSentryEnabled()) return;

  return Sentry.captureException(exception, captureContext);
}
