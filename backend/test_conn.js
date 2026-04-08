import 'dotenv/config';
import knex from 'knex';
import { createClient } from 'redis';

async function testConnections() {
  console.log('Testing Database connection...');
  const db = knex({
    client: 'postgresql',
    connection: {
      connectionString: process.env.DB_URL,
      ssl: { rejectUnauthorized: false }
    }
  });

  try {
    const result = await db.raw('SELECT 1');
    console.log('Database connection successful:', result.rows);
  } catch (err) {
    console.error('Database connection failed:', err.message);
  } finally {
    await db.destroy();
  }

  console.log('\nTesting Redis connection...');
  const redisClient = createClient({
    url: process.env.REDIS_URL,
    socket: {
      tls: process.env.REDIS_URL?.startsWith('rediss://'),
      rejectUnauthorized: false
    }
  });

  try {
    await redisClient.connect();
    const pong = await redisClient.ping();
    console.log('Redis connection successful:', pong);
  } catch (err) {
    console.error('Redis connection failed:', err.message);
  } finally {
    await redisClient.quit();
  }
}

testConnections();
