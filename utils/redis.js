import { createClient } from "redis";

const redisClient = createClient({
  uri: process.env.REDIS_URI
});

redisClient.on("connect", () => {
  console.log("Redis client connected to the server");
});

redisClient.on("error", (error) => {
  console.log(`Redis client not connected to the server: ${error}`);
});

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

export default redisClient;