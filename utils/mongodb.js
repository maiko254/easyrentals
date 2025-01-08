import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise;
console.log("Uri: ", uri);
if (!uri) {
  throw new Error("Please define the MONGO_URI environment variable");
}

if (process.env.NODE_ENV === "development") {
  console.log("Connecting to MongoDB in development mode");
  // In development mode, use a global variable so the value is preserved across module reloads in the same process.
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else if (process.env.NODE_ENV === "test") {
  console.log("Connecting to MongoDB in test mode");
  // In test mode, use a new client per test so that tests run in parallel without sharing the client.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
} else {
  // In production, create a new client per request.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

