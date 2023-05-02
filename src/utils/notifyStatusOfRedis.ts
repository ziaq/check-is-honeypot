import sendTelegramNotification from './sendTelegramNotification';
import logger from './logger';
import { Redis } from 'ioredis';

function notifyStatusOfRedis(redisClient: Redis, clientName: string, needCheckSettings: boolean = false): void {
  redisClient.on('ready', () => {
    logger.info(`Connected to redis, client ${clientName}`);
    if (needCheckSettings) {
      checkRedisSettings(redisClient);
    }
  });

  redisClient.on('error', (error: Error) => {
    const message = `Error connecting to redis, client ${clientName}, error: ${error.message}`;
    logger.error(message);
    sendTelegramNotification(message);
  });
}

function checkRedisSettings(redisClient: Redis): void {
  redisClient.config('GET', 'notify-keyspace-events', (err: Error, results: string[]) => {
    if (results[1] === 'AE') {
      logger.info(`Right redis settings, notify-keyspace-events ${results[1]}`);
    } else {
      logger.error(`Wrong redis settings, notify-keyspace-events must be [ AE ] but now ${results[1]}`);
    }
  });
}

export default notifyStatusOfRedis;