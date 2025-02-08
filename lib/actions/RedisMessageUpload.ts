"use server";
import { createClient } from "redis";
import { Message } from "../types";

const redisUrl = process.env.NEXT_PUBLIC_REDIS_URL;
const redisPassword = process.env.NEXT_REDIS_PASSWORD;
console.log(redisUrl);
const client = createClient({
  password: redisPassword,
  socket: {
    host: redisUrl,
    port: 12647
  }
});
export const uploadOnRedis = async (Message: Message, roomId: string) => {
  client.connect();
  try {
    await client.lPush(
      "message",
      JSON.stringify({ Message, roomId }),
    );
    console.log("uploaded on redis");
  } catch (error) {
    console.error("couldn't uploaded on redis: " + error);
  } finally {
    client.disconnect();
  }
}
