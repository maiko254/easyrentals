import clientPromise from "../../utils/mongodb";
import { MongoClient } from "mongodb";

describe("Testing MongoDB connection", () => {
  it('should connect to MongoDB successfully', async () => {
    let client;
    try {
      client = await clientPromise;
      expect(client).toBeDefined();
      expect(client.topology.isConnected()).toBe(true);
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    } finally {
      if (client) {
        await client.close();
      }
    }
  });

  /*it('should fail to connect to MongoDB', async () => {
    const wrongUri = 'mongodb://127.0.0.1:27017';
    let client;
    try {
      client = new MongoClient(wrongUri);
      await client.connect();
    } catch (error) {
      console.log('Error connecting to MongoDB:', error);
      expect(error.message).toMatch('Please define the MONGO_URI environment variable');
    } finally {
      if (client) {
        await client.close();
      }
    }
  });*/
});