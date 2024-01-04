import Redis from 'ioredis';
import logger from './logger';
import redisConfig from '../config/redis';

const redisClient = new Redis(redisConfig);

redisClient.on('ready', () => {
  logger.info(`Workers are ready!`);

  redisClient.disconnect();
});
