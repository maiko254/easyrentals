import { MongoClient } from 'mongodb';

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;

  namespace NodeJS {
    interface Global {
      _mongoClientPromise: Promise<MongoClient> | undefined;
    }
  }
}