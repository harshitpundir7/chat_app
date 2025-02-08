"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const websocketClasses_1 = require("./websocketClasses");
const server = new websocketClasses_1.websocketClasses(8080);
server.start();
