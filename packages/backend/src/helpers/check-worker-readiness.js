import Redis from 'ioredis';
import logger from './logger.js';
import redisConfig from '../config/redis.js';

const redisClient = new Redis(redisConfig);

redisClient.on('ready', () => {
  logger.info(`Workers are ready!`);

  redisClient.disconnect();
});
