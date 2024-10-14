"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@redis/client");
const pg_1 = require("pg");
const uuid_1 = require("uuid");
const redisClient = (0, client_1.createClient)();
const pool = new pg_1.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'mysecretpassword',
    port: 5432,
    // ssl: { rejectUnauthorized: false },
});
function worker() {
    return __awaiter(this, void 0, void 0, function* () {
        yield redisClient.connect();
        const pgClient = yield pool.connect();
        try {
            while (true) {
                const response = yield redisClient.brPop("message", 0);
                const data = JSON.parse(response === null || response === void 0 ? void 0 : response.element);
                const msg = "";
                // uploading msg
                try {
                    const result = yield pgClient.query(`INSERT INTO "Message" (id, content, "userId", "ChatRoomId", "createdAt")
           VALUES ($1, $2, $3, $4, $5) RETURNING *`, [(0, uuid_1.v4)(), data.Message.content, data.Message.from, data.roomId, new Date()]);
                    console.log("created on db");
                }
                catch (error) {
                    console.error('Error creating message:', error);
                }
            }
        }
        finally {
            pgClient.release();
            yield redisClient.disconnect();
        }
    });
}
worker().catch(console.error);
