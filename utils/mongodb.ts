import { MongoClient } from "mongodb";

const url = process.env.MONGO_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;
console.log("url: ", url);
if (!url) {
  throw new Error("Please define the MONGO_URI environment variable");
}

if (process.env.NODE_ENV === "development") {
  console.log("Connecting to MongoDB in development mode");
  // In development mode, use a global variable so the value is preserved across module reloads in the same process.
  if (!global._mongoClientPromise) {
    client = new MongoClient(url, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else if (process.env.NODE_ENV === "test") {
  console.log("Connecting to MongoDB in test mode");
  // In test mode, use a new client per test so that tests run in parallel without sharing the client.
  client = new MongoClient(url, options);
  clientPromise = client.connect();
} else {
  // In production, create a new client per request.
  client = new MongoClient(url, options);
  clientPromise = client.connect();
}

clientPromise.then((client) => console.log("Connected to MongoDB"))
  .catch((error) => console.log(`Error connecting to MongoDB ${error}`));

export default clientPromise;

