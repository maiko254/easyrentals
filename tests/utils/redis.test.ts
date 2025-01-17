import redisClient from "../../utils/redis";
import { createClient } from "redis";

beforeAll(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
});

afterAll(async () => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
});

beforeEach(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
});

afterEach(async () => {
  if (redisClient.isOpen) {
    await redisClient.disconnect();
  }
});

describe("Testing Redis connection", () => {
  it("should connect to Redis successfully", async () => {
    await new Promise((resolve) => {
      redisClient.on("connect", () => {
        expect(redisClient.isOpen).toBe(true);
        resolve(null);
      });
    });
  });

  /**it("should handle Redis connection error", async () => {
    const originalUrl = process.env.REDIS_URI;
    process.env.REDIS_URI = "redis://invalid-url";

    const faultyClient = createClient({
      url: process.env.REDIS_URI
    });

    await new Promise((resolve) => {
      faultyClient.on("error", (error) => {
        expect(error).toBeDefined();
        resolve(null);
      });

      faultyClient.connect().catch(() => {});
    });

    process.env.REDIS_URI = originalUrl;
  });*/
  
  it("should disconnect from Redis successfully", async () => {
    await redisClient.disconnect();
    expect(redisClient.isOpen).toBe(false);
  });

  it("should set and get a value in Redis", async () => {
    await redisClient.set("test_key", "test_value");
    const value = await redisClient.get("test_key");
    expect(value).toBe("test_value");
  });

  it("should delete a value in Redis", async () => {
    await redisClient.set("test_key", "test_value");
    await redisClient.del("test_key");
    const value = await redisClient.get("test_key");
    expect(value).toBeNull();
  });

  it("should handle Redis command error", async () => {
    try {
      await redisClient.sendCommand(["INVALID_COMMAND"]);
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});