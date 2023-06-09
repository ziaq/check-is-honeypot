import Redis from "ioredis";

import config from "../../config/config";
import notifyStatusOfRedis from "../utils/notifyStatusOfRedis";

const redisClientDb1 = new Redis({ host: config.redisHost, port: config.redisPort, db: 1 });
notifyStatusOfRedis(redisClientDb1, "redisClientDb1", true);

const redisSubscriberDb0 = new Redis({ host: config.redisHost, port: config.redisPort, db: 0 });
notifyStatusOfRedis(redisSubscriberDb0, "redisSubscriberDb0");

export { redisClientDb1, redisSubscriberDb0 };