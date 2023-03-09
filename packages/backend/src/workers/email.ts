import { Worker } from 'bullmq';
import redisConfig from '../config/redis';
import logger from '../helpers/logger';
import mailer from '../helpers/mailer.ee';
import compileEmail from '../helpers/compile-email.ee';
import appConfig from '../config/app';

export const worker = new Worker(
  'email',
  async (job) => {
    const { email, subject, template, params } = job.data;

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
  logger.info(
    `JOB ID: ${job.id} - ${job.data.subject} email to ${job.data.email} has failed to send with ${err.message}`
  );
});

process.on('SIGTERM', async () => {
  await worker.close();
});
