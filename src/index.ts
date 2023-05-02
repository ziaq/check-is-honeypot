import { redisSubscriberDb0 } from './connections/redisInstances';
import processTokenInfo from './core/processTokenInfo';
import logger from './utils/logger';
import getLiquidityPairAndRouter from './core/getLiquidityPairAndRouter';

async function listenRedisUpdates() {
  redisSubscriberDb0.on("pmessage", async (pattern: string, channel: string, message: string) => {
    if (channel == '__keyevent@0__:set') {
      const tokenAddress = message;
      logger.info(`Retrieved new key ${tokenAddress} from db0`);

      const { pair, router } = await getLiquidityPairAndRouter(tokenAddress);
      if (!pair) return;

      processTokenInfo(tokenAddress, pair, router);
    }
  });

  redisSubscriberDb0.psubscribe("__keyevent@0__:*");
}

listenRedisUpdates();
