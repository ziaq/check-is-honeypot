import Redis from "ioredis";

import config from "../../config/config";
import notifyStatusOfRedis from "../utils/notifyStatusOfRedis";

const redisClientDb1 = new Redis({ connectionString: config.redisUrl, db: 1 });
notifyStatusOfRedis(redisClientDb1, "redisClientDb1", true);

const redisSubscriberDb0 = new Redis({ connectionString: config.redisUrl, db: 0 });
notifyStatusOfRedis(redisSubscriberDb0, "redisSubscriberDb0");

export { redisClientDb1, redisSubscriberDb0 };
