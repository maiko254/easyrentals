import redisClient from "../../utils/redis";

describe("Testing Redis connection", () => {
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

  it("should connect to Redis successfully", () => {
    expect(redisClient.isOpen).toBe(true);
  });
});