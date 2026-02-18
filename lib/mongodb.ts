import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const DB_NAME = 'kidsgame';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(uri);
  await client.connect();

  cachedClient = client;
  cachedDb = client.db(DB_NAME);

  return cachedDb;
}
