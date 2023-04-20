const axios = require("axios");
const Redis = require("ioredis");
const config = require("./config");
const logger = require("./logger");

async function getSpecifications(address, response, redisClient) {
  try {
    const router = response.data[0].Router;
    const pair = response.data[0].Pair.Address;
    const tokens = response.data[0].Pair.Tokens;
    const name = response.data[0].Pair.Name;
    const liquidity = response.data[0].Liquidity;
    const responseSpecs = await axios.get(
      `https://api.honeypot.is/v1/IsHoneypot?address=${address}&router=${router}&pair=${pair}&chainID=1`
    );

    redisClient.set(address, JSON.stringify(responseSpecs.data));

    logger.getSpecs(
      `Address: ${address}, responseSpecs: ${JSON.stringify(responseSpecs.data, null, 2)}`
    );
  } catch (error) {
    logger.error(`Error: ${error.message}`);
  }
}


async function getPairs(address, redisClient) {
  try {
    const response = await axios.get(
      `https://api.honeypot.is/v1/GetPairs?address=${address}&chainID=1`
    );
    
    getSpecifications(address, response, redisClient);

    logger.getPair(
      `Address: ${address}, Response: ${JSON.stringify(response.data, null, 2)}`
    );
  } catch (error) {
    logger.error(`Error: ${error.message}`);
  }
}

async function runSubscribeOnRedis() {
  const redisClient = new Redis({ url: config.redisUrl, db: 1 });
  const redisSubscriber = new Redis({ url: config.redisUrl, db: 0 });

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