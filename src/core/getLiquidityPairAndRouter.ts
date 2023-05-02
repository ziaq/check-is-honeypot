import axios, { AxiosResponse } from "axios";
import logger from "../utils/logger";
import sendTelegramNotification from "../utils/sendTelegramNotification";

interface PairAndRouter {
  pair: string | null;
  router: string | null;
}

async function getLiquidityPairAndRouter(tokenAddress: string, retries = 2): Promise<PairAndRouter> {
  try {
    const response = await axios.get("https://api.honeypot.is/v1/GetPairs", {
      params: {
        address: tokenAddress,
        chainID: 1,
      },
    }) as AxiosResponse;

    const router = response.data[0]?.Router;
    const pair = response.data[0]?.Pair?.Address;

    if (
      !pair ||
      !router ||
      router === '0x0000000000000000000000000000000000000000' || 
      pair === '0x0000000000000000000000000000000000000000'
      ) {
      logger.fetch(
        `getLiquidityPairAndRouter return 0x000000 for token ${tokenAddress} retries left ${retries}`
      );

      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 60000));
        return await getLiquidityPairAndRouter(tokenAddress, retries - 1);
      } else {
        logger.info(`Skip token ${tokenAddress} getLiquidityPairAndRouter always revert 0x000000`);
        return { router: null, pair: null };
      }
    }

    logger.fetch(`Successful getLiquidityPairAndRouter for token ${tokenAddress} pair ${pair} router ${router}`);
    return { pair, router }

  } catch (error) {
    logger.error(`Error in getLiquidityPairAndRouter. ${error.message}`);
    sendTelegramNotification(`Error in getLiquidityPairAndRouter. ${error.message}`);
    return { pair: null, router: null }
  }
}

export default getLiquidityPairAndRouter;