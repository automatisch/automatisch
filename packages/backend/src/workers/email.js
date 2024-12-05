import { Worker } from 'bullmq';

import * as Sentry from '../helpers/sentry.ee.js';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';
import mailer from '../helpers/mailer.ee.js';
import compileEmail from '../helpers/compile-email.ee.js';
import appConfig from '../config/app.js';

const isCloudSandbox = () => {
  return appConfig.isCloud && !appConfig.isProd;
};

const isAutomatischEmail = (email) => {
  return email.endsWith('@automatisch.io');
};

const emailWorker = new Worker(
  'email',
  async (job) => {
    const { email, subject, template, params } = job.data;

    if (isCloudSandbox() && !isAutomatischEmail(email)) {
      logger.info(
        'Only Automatisch emails are allowed for non-production environments!'
      );

      return;
    }

    await mailer.sendMail({
      to: email,
      from: appConfig.fromEmail,
      subject: subject,
      html: compileEmail(template, params),
    });
  },
  { connection: redisConfig }
);

emailWorker.on('completed', (job) => {
  logger.info(
    `JOB ID: ${job.id} - ${job.data.subject} email sent to ${job.data.email}!`
  );
});

emailWorker.on('failed', (job, err) => {
  const errorMessage = `
    JOB ID: ${job.id} - ${job.data.subject} email to ${job.data.email} has failed to send with ${err.message}
    \n ${err.stack}
  `;

  logger.error(errorMessage);

  Sentry.captureException(err, {
    extra: {
      jobId: job.id,
    },
  });
});

export default emailWorker;
