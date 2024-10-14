"use server";
import {createClient} from "redis";
import { Message } from "../schema";
export const uploadOnRedis =async(Message : Message,roomId : string) =>{
    const client = createClient();
    client.connect();
    try {
        await client.lPush(
            "message",
            JSON.stringify({Message,roomId}),
        );
        console.log("uploaded on redis");
    } catch (error) {
        console.error("couldn't uploaded on redis: "+ error);
    } finally {
        client.disconnect();
    }
}