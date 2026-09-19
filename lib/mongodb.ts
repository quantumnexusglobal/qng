/**
 * QNexus — MongoDB Connection Helper with Connection Caching
 */

import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
const options = {
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 5000,
};

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export async function getMongoDbClient(): Promise<MongoClient | null> {
  if (!uri) {
    return null;
  }

  try {
    if (process.env.NODE_ENV === 'development') {
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      if (!clientPromise) {
        client = new MongoClient(uri, options);
        clientPromise = client.connect();
      }
    }
    return await clientPromise;
  } catch (error) {
    console.warn('[MongoDB] Connection attempt failed (using fallback store):', error);
    return null;
  }
}

export async function getMongoDbDatabase(dbName = 'qnexus'): Promise<Db | null> {
  try {
    const connectedClient = await getMongoDbClient();
    if (!connectedClient) return null;
    return connectedClient.db(dbName);
  } catch (error) {
    console.warn('[MongoDB] Database selection error:', error);
    return null;
  }
}

// Alias for getMongoDbDatabase
export const getDatabase = getMongoDbDatabase;

export default getMongoDbClient;
