import { Queue, Worker } from 'bullmq';
import redisConfig from '../config/redis.js';
import logger from '../helpers/logger.js';
import BaseQueue from './base.js';

const CONNECTION_REFUSED = 'ECONNREFUSED';

class BullMQQueue extends BaseQueue {
  static queueOptions = {
    connection: redisConfig,
  };

  constructor(name) {
    super(name);

    this.queue = new Queue(name, this.constructor.queueOptions);
    this.workers = [];

    this.setupErrorHandlers();
    this.setupGracefulShutdown();
  }

  async add(jobName, data, options = {}) {
    try {
      const job = await this.queue.add(jobName, data, options);

      return job;
    } catch (error) {
      logger.error(`Failed to add job to queue "${this.name}":`, error);

      throw error;
    }
  }

  async remove(jobId) {
    try {
      const job = await this.getJob(jobId);

      if (job) {
        await job.remove();
        return true;
      }

      return false;
    } catch (error) {
      logger.error(`Failed to remove job from queue "${this.name}":`, error);

      throw error;
    }
  }

  async getJob(jobId) {
    return await this.queue.getJob(jobId);
  }

  async getRepeatableJobById(jobId) {
    const repeatableJobs = await this.getRepeatableJobs();
    const job = repeatableJobs.find((job) => job.id === jobId);

    return job;
  }

  async getRepeatableJobs() {
    try {
      return await this.queue.getRepeatableJobs();
    } catch (error) {
      logger.error(
        `Failed to get repeatable jobs from queue "${this.name}":`,
        error
      );

      throw error;
    }
  }

  async removeRepeatableJobByKey(jobKey) {
    try {
      await this.queue.removeRepeatableByKey(jobKey);

      return true;
    } catch (error) {
      logger.error(
        `Failed to remove repeatable job from queue "${this.name}":`,
        error
      );

      throw error;
    }
  }

  async removeRepeatableJobById(jobId) {
    const job = await this.getRepeatableJobById(jobId);

    return await this.removeRepeatableJobByKey(job.key);
  }

  startWorker(processor, workerOptions = {}) {
    const worker = new Worker(this.name, processor, {
      ...this.queueOptions,
      ...workerOptions,
    });

    worker.on('error', (error) => {
      logger.error(`Worker error in queue "${this.name}":`, error);
    });

    this.workers.push(worker);

    return worker;
  }

  setupErrorHandlers() {
    this.queue.on('error', (error) => {
      if (error.code === CONNECTION_REFUSED) {
        logger.error(
          'Make sure you have installed Redis and it is running.',
          error
        );

        process.exit();
      }

      logger.error(`Queue error in "${this.name}":`, error);
    });
  }

  setupGracefulShutdown() {
    const shutdown = async () => {
      logger.log(`Shutting down queue "${this.name}"...`);

      try {
        // Close all workers gracefully
        for (const worker of this.workers) {
          await worker.close();
        }

        await this.queue.close();

        logger.log(`Queue "${this.name}" shut down successfully.`);

        process.exit();
      } catch (error) {
        logger.error(`Error during shutdown of queue "${this.name}":`, error);

        process.exit(1);
      }
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  }
}

export default BullMQQueue;
