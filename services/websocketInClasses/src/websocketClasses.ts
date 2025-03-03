import { WebSocketServer, WebSocket } from "ws";

export class websocketClasses {
  private static wss: WebSocketServer;
  private static rooms: { [roomId: string]: Set<WebSocket> } = {};
  private static users: number[] = [];
  private static userRooms: Map<WebSocket, string> = new Map();
  private static userConnections: Map<number, WebSocket> = new Map();

  constructor(port: number) {
    const server = new WebSocket.Server({ port: port })
    websocketClasses.wss = server
  }

  start() {
    websocketClasses.wss.on("connection", (ws) => this.handleConnection(ws))
  }

  handleConnection(ws: any) {
    ws.on("message", (data: string) => {
      const msg = JSON.parse(data);
      console.log(msg)
      switch (msg.type) {
        case "connect": this.connectServer(ws, msg.userId);
          break;
        case "join": this.joinRoom(msg.roomId, ws);
          break;
        case "message": this.broadcast(msg.message, msg.roomId, ws, msg.from);
          break;
        case "onType": this.broadcastTyping(ws, msg.roomId);
          break;
        case "global": this.joinRoom("global", ws);
          break;
        default: console.log("wrong input");
      }
    })
    ws.on("close", () => {
      this.disconnect(ws);
    });

    ws.on("error", (err: any) => {
      console.error("WebSocket error:", err);
      this.disconnect(ws);
    });
  }

  //to connect 
  private connectServer(ws: any, userId: number) {
    const existingConnection = websocketClasses.userConnections.get(userId);
    if (existingConnection) {
      existingConnection.close();
    }

    websocketClasses.userConnections.set(userId, ws);

    if (!websocketClasses.users.includes(userId)) {
      websocketClasses.users.push(userId);
    }

    ws.userId = userId;

    ws.send(JSON.stringify({
      "type": "connection",
      "message": "you have connected to server",
    }));

    this.broadcastUsers();
  }

  //on typing
  private broadcastTyping(ws: WebSocket, roomId: string) {

    // const userRoom = websocketClasses.userRooms.get(ws);
    // if (!userRoom || userRoom !== roomId) {
    //   ws.send(JSON.stringify({ type: "error", messsage: "first join the room" }));
    // }
    // const roomUsers = websocketClasses.rooms[roomId];
    // roomUsers.forEach(user => {
    //   user.send(JSON.stringify({ type: "isTyping", message: true }))
    // })
  }

  //on join room
  private joinRoom(roomId: string, ws: any) {
    if (websocketClasses.userRooms.has(ws)) {
      const prevRoom = websocketClasses.userRooms.get(ws);
      if (prevRoom) {
        websocketClasses.rooms[prevRoom].delete(ws);
        if (websocketClasses.rooms[prevRoom].size === 0) {
          delete websocketClasses.rooms[prevRoom];
        }
      }
    }

    websocketClasses.userRooms.set(ws, roomId);

    if (!websocketClasses.rooms[roomId]) {
      websocketClasses.rooms[roomId] = new Set();
    }
    websocketClasses.rooms[roomId].add(ws);

    ws.send(JSON.stringify({
      "type": "join",
      "message": `you have joined ${roomId}`,
    }));
  }

  //disconnect
  private disconnect(ws: any) {
    const userId = ws.userId;

    if (!userId) {
      console.log("Disconnecting websocket without userId");
      return;
    }

    if (websocketClasses.userRooms.has(ws)) {
      const roomId = websocketClasses.userRooms.get(ws);
      if (roomId) {
        websocketClasses.rooms[roomId]?.delete(ws);

        if (websocketClasses.rooms[roomId]?.size === 0) {
          delete websocketClasses.rooms[roomId];
        }
      }
      websocketClasses.userRooms.delete(ws);
    }

    websocketClasses.userConnections.delete(userId);

    websocketClasses.users = websocketClasses.users.filter(user => user !== userId);

    this.broadcastUsers();

    console.log(`User ${userId} disconnected`);
    console.log("Remaining users:", websocketClasses.users);
  }

  //broadcast
  private broadcast(message: string, roomId: string, ws: WebSocket, from: number) {
    const userRoom = websocketClasses.userRooms.get(ws);
    if (!userRoom || userRoom !== roomId) {
      ws.send(JSON.stringify({ type: "error", message: "first join the room" }));
      return;
    }

    const roomUsers = websocketClasses.rooms[roomId];
    roomUsers.forEach((user) => {
      if (user !== ws && user.readyState === WebSocket.OPEN) {
        user.send(JSON.stringify({
          type: "message",
          message: {
            from: from,
            roomId: roomId,
            content: message
          }
        }));
      }
    });
  }

  private broadcastUsers() {
    websocketClasses.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(
          JSON.stringify({
            type: "connectedUsers",
            message: [...websocketClasses.users],
          })
        );
      }
    });

    console.log("Broadcasting users:", websocketClasses.users);
  }
}
