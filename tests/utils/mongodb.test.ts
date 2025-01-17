import clientPromise from "../../utils/mongodb";
import { Db, MongoClient } from 'mongodb';

let client: MongoClient;
let db: Db;

beforeAll(async () => {
  client = await clientPromise;
  db = client.db();
})

afterAll(async () => {
  await client.close();
});

describe("Testing MongoDB connection", () => {
  it('should connect to MongoDB successfully', async () => {
    try {
      expect(client).toBeDefined();
      expect(db).toBeDefined();
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      throw error;
    } finally {
      if (client) {
        await client.close();
      }
    }
  });

  /**it('should fail to connect to MongoDB', async () => {
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