import { createClient } from "@redis/client";
import { Pool } from "pg";
import { v4 as uuidv4 } from 'uuid';

const redisClient = createClient();

interface Message {
  from: number;
  to: number;
  content: string;
}

interface ServerMessage {
  Message: Message;
  roomId: string;
}

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'mysecretpassword',
  port: 5432,
  // ssl: { rejectUnauthorized: false },
});

async function worker() {
  await redisClient.connect();
  const pgClient = await pool.connect();
  
  try {
    while (true) {
      const response = await redisClient.brPop("message", 0);
      const data: ServerMessage = JSON.parse(response?.element as string);
      const msg ="";
      // uploading msg
      try {
        const result = await pgClient.query(
          `INSERT INTO "Message" (id, content, "userId", "ChatRoomId", "createdAt")
           VALUES ($1, $2, $3, $4, $5) RETURNING *`,
          [uuidv4(), data.Message.content, data.Message.from, data.roomId, new Date()]
        );
        console.log("created on db");
      } catch (error) {
        console.error('Error creating message:', error);
      }
    }
  } finally {
    pgClient.release();
    await redisClient.disconnect();
  }
}

worker().catch(console.error);