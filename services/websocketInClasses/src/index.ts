import { websocketClasses } from "./websocketClasses";

const server = new websocketClasses(8080);
server.start();
