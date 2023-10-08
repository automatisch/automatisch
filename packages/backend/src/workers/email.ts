import { Worker } from 'bullmq';

import * as Sentry from '../helpers/sentry.ee';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';
import mailer from '../helpers/mailer.ee';
import compileEmail from '../helpers/compile-email.ee';
import appConfig from '../config/app';

const isCloudSandbox = () => {
  return appConfig.isCloud && !appConfig.isProd;
};

const isAutomatischEmail = (email: string) => {
  return email.endsWith('@automatisch.io');
};

export const worker = new Worker(
  'email',
  async (job) => {
    const { email, subject, template, params } = job.data;

    if (isCloudSandbox && !isAutomatischEmail(email)) {
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

worker.on('completed', (job) => {
  logger.info(
    `JOB ID: ${job.id} - ${job.data.subject} email sent to ${job.data.email}!`
  );
});

worker.on('failed', (job, err) => {
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

process.on('SIGTERM', async () => {
  await worker.close();
});
