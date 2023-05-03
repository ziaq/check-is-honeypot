import { Redis } from 'ioredis';
import sendTelegramNotification from './sendTelegramNotification';
import logger from './logger';

async function notifyStatusOfRedis(redisClient: Redis, clientName: string, needCheckSettings = false): Promise<void> {
  redisClient.on('ready', async () => {
    logger.info(`Connected to redis, client ${clientName}`);
    if (needCheckSettings) {
      await checkRedisSettings(redisClient);
    }
  });

  redisClient.on('error', (error: Error) => {
    const message = `Error connecting to redis, client ${clientName}, error: ${error.message}`;
    logger.error(message);
    sendTelegramNotification(message);
  });
}

async function checkRedisSettings(redisClient: Redis): Promise<void> {
  const result = await redisClient.config('GET', 'notify-keyspace-events') as [string, string];

  if (result[1] === 'AE') {
    logger.info(`Right redis settings, notify-keyspace-events ${result[1]}`);
  } else {
    logger.error(`Wrong redis settings, notify-keyspace-events must be [ AE ] but now ${result[1]}`);
  }
}

export default notifyStatusOfRedis;