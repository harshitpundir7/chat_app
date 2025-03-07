import { websocketClasses } from "./websocketClasses";
import { configDotenv } from "dotenv"

configDotenv()
const port = process.env.PORT
console.log(port)
const server = new websocketClasses(8080);
server.start();
