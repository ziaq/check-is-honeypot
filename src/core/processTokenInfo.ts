import axios, { AxiosResponse } from "axios";
import sendTelegramNotification from "../utils/sendTelegramNotification";
import logger from "../utils/logger";
import { redisClientDb1 } from "../connections/redisInstances";

async function processTokenInfo(tokenAddress: string, pair: string, router: string, retries = 2): Promise<void> {
  try {
    const [tokenSpecsRespFromApi, isVerifiedAndProxyCallsRespFromApi] = await Promise.all([
      axios({
        method: 'get',
        url: 'https://api.honeypot.is/v2/IsHoneypot',
        params: {
          address: tokenAddress,
          router: router,
          pair: pair,
          chainID: 1,
        },
      }),
      axios({
        method: 'get',
        url: 'https://sapi.honeypot.is/v1/GetContractVerification',
        params: {
          address: tokenAddress,
          router: router,
          pair: pair,
          chainID: 1,
        },
      }).catch((error) => {
        return null;
      }),
    ]) as [AxiosResponse, (AxiosResponse | null)];

    function determineIsVerifiedAndHasProxyCalls() {
      if (!isVerifiedAndProxyCallsRespFromApi) {
        return { isVerified: false, numContractsInBundle: 0, hasProxyCalls: false };
      }

      const hasProxyCalls = isVerifiedAndProxyCallsRespFromApi.data.HasProxyCalls;
      const contractsInBundle = Object.keys(isVerifiedAndProxyCallsRespFromApi.data.Contracts);
      const numContractsInBundle = contractsInBundle.length;

      let isVerified;
      if (numContractsInBundle === 2) {
        isVerified = isVerifiedAndProxyCallsRespFromApi.data.Contracts[contractsInBundle[0]] &&
        isVerifiedAndProxyCallsRespFromApi.data.Contracts[contractsInBundle[1]];
      } else {
        isVerified = isVerifiedAndProxyCallsRespFromApi.data.Contracts[contractsInBundle[0]];
      }

      return { isVerified, numContractsInBundle, hasProxyCalls }
    }

    if (!isVerifiedAndProxyCallsRespFromApi) {
      logger.fetch(
        `Failed verification checking for token ${tokenAddress}, ` +
        `honeypot api can't check token verification. Retries left ${retries}`
      );

      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 240000));
        return await processTokenInfo(tokenAddress, pair, router, retries - 1);
      } else {
        logger.info(
          `Honeypot identified token ${tokenAddress}, honeypot api can't check token verification`
        );
        return;
      }
    }

    const tokenSpecs = tokenSpecsRespFromApi.data;

    logger.fetch(
      `tokenAddress ${tokenAddress} tokenSpecs ${JSON.stringify(tokenSpecs)}\n` +
      `isVerifiedAndProxyCallsRespFromApi ` +
      `${JSON.stringify(isVerifiedAndProxyCallsRespFromApi.data)}`
    );

    const { isVerified, numContractsInBundle, hasProxyCalls } = determineIsVerifiedAndHasProxyCalls();

    if (!isVerified) {
      logger.info(
        `Honeypot identified token ${tokenAddress}, it isn't verified ` +
        `contracts in bundle ${numContractsInBundle}`
      );
      return;
    }

    if (hasProxyCalls) {
      logger.info(`Honeypot identified token ${tokenAddress} it has proxy calls ${hasProxyCalls}`);
      return;
    }
    
    if (tokenSpecs.honeypotResult.isHoneypot) {
      logger.info(
        `Honeypot identified token ${tokenAddress}, ` +
        `honeypotReason ${tokenSpecs.honeypotResult.honeypotReason}`
      );
      return;
    }
    
    // Expiration time 36 hours (129600 seconds)
    redisClientDb1.set(tokenAddress.toLowerCase(), 'notAHoneypot', 'EX', 129600);
    logger.info(`Not honeypot identified ${tokenSpecs.token.name} ${tokenAddress} set to db1`);
    
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error in processTokenInfo. ${error.message}`);
      sendTelegramNotification(`Error in processTokenInfo. ${error.message}`);
    } else {
      logger.error(`Error in processTokenInfo. Unknown error`);
      sendTelegramNotification(`Error in processTokenInfo. Unknown error`);
    }
    return;
  }
}
  
export default processTokenInfo;