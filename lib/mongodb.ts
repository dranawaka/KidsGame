import { MongoClient, Db } from 'mongodb';

const DB_NAME = 'kidsgame';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

/** True when MONGODB_URI is set (leaderboard can persist to DB). */
export function isMongoConfigured(): boolean {
  return Boolean(process.env.MONGODB_URI);
}

export async function getDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const client = new MongoClient(uri);
  await client.connect();

  cachedClient = client;
  cachedDb = client.db(DB_NAME);

  return cachedDb;
}
