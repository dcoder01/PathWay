const redisConfig = require("../config/redisConfig");

let redis;

const redisCache = {
    async get(key) {
        if (!redis) redis = await redisConfig();
        const value = await redis.get(key);
        return value ? JSON.parse(value) : null;
    },

    async set(key, data, ttl = 3600) {
        if (!redis) redis = await redisConfig();
        return await redis.set(key, JSON.stringify(data), { EX: ttl });
    },

    async del(key) {
        if (!redis) redis = await redisConfig();
        return await redis.del(key);
    },
};

module.exports = redisCache;