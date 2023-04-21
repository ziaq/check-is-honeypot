import axios from 'axios';
import Redis from 'ioredis';
import config from './config';
import logger from './utils/logger';
import generateTokenInfoMessage from './utils/generateTokenInfoMessage';
import sendTelegramNotification from './utils/sendTelegramNotification';

interface PairData {
  Router: string;
  Pair: {
    Address: string;
  };
}

async function getSpecifications(address: string, response: { data: PairData[] }, redisClient: Redis) {
  try {
    const router = response.data[0].Router;
    const pair = response.data[0].Pair.Address;

    const [responseGetSpecs, responseIsVarifed] = await Promise.all([
      axios.get(`https://api.honeypot.is/v1/IsHoneypot?address=${address}&router=${router}&pair=${pair}&chainID=1`),
      axios.get(`https://sapi.honeypot.is/v1/GetContractVerification?address=${address}&router=${router}&pair=${pair}&chainID=1`)
    ]);
    const tokenSpecs = responseGetSpecs.data;
    const isVarifedObj = responseIsVarifed.data;

    const tokenInfoMessage = generateTokenInfoMessage(tokenSpecs, isVarifedObj, address).trim();

    redisClient.set(address, JSON.stringify(tokenInfoMessage));
    sendTelegramNotification(tokenInfoMessage);
    logger.getSpecs(`Address: ${address}, isVarifedObj: ${JSON.stringify(isVarifedObj)}`);
    logger.getSpecs(`Address: ${address}, responseSpecs: ${tokenInfoMessage}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
      sendTelegramNotification(error.message);
    }
  }
}

async function getPairs(address: string, redisClient: Redis) {
  try {
    const response = await axios.get(
      `https://api.honeypot.is/v1/GetPairs?address=${address}&chainID=1`
    );

    getSpecifications(address, response, redisClient);

    logger.getPair(`Address: ${address}, Response: ${JSON.stringify(response.data[0])}`);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Error: ${error.message}`);
    }
  }
}

async function runSubscribeOnRedis() {
  const redisClient = new Redis({
    host: config.redisHost,
    port: config.redisPort,
    db: 1,
  });
  
  const redisSubscriber = new Redis({
    host: config.redisHost,
    port: config.redisPort,
    db: 0,
  });

  redisClient.on("connect", function () {
    logger.info("Connected to Redis");
  });

  redisClient.on("error", function (error) {
    logger.error(`Redis Error: ${error}`);
  });

  redisSubscriber.on("pmessage", async (pattern, channel, message) => {
    if (message == 'set') {
      const address = channel.split(":")[1]; // Get address from __keyspace@0__:address
      await getPairs(address, redisClient);
    }
  });

  redisSubscriber.psubscribe("__keyspace@0__:*");
}

runSubscribeOnRedis();