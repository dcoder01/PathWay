const { createClient } = require("redis");

let redis; //for reuse

async function redisConfig() {
    if (redis) return redis;

    redis = createClient({
        url: process.env.REDIS_URL,
    });

    redis.on("error", (err) => console.error("Redis Error:", err));
    redis.on("connect", () => console.log("Redis connected"));

    await redis.connect();
    return redis;
}

module.exports = redisConfig;
