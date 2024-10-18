import WebSocket, { WebSocketServer } from "ws";
import http from "http";

const server = http.createServer((req: any, res: any) => {
  // console.log(new Date() + ` received request for ` + req.url);
  res.end("hi there");
});

const wss = new WebSocketServer({ server });

let userCount = 0;

// Store clients by room
const rooms: { [roomId: string]: Set<WebSocket> } = {};

wss.on('connection', function connection(ws) {
  // Error handling
  ws.on('error', console.error);

  // Room variable to store the room of this client
  let currentRoom: string | null = null;

  ws.on('message', function message(data: string) {
    const message = JSON.parse(data);
    if (message.type === 'join') {
      const roomId = message.roomId;
      if (currentRoom && rooms[currentRoom]) {
        rooms[currentRoom].delete(ws);
        if (rooms[currentRoom].size === 0) {
          delete rooms[currentRoom]; // Delete empty room
        }
      }
      // Join the new room
      currentRoom = roomId;
      if (!roomId) currentRoom = "global";

      if (!rooms[roomId]) {
        rooms[roomId] = new Set();
      }

      rooms[roomId].add(ws);
      ws.send(`You joined room: ${currentRoom}`);;
    }
    else if (message.type === 'message' && currentRoom) {
      const roomClients = rooms[currentRoom];
      if (roomClients) {
        roomClients.forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              message: message.content,
              roomId: currentRoom,
            }));
          }
        });
      }
    }
  });

  console.log("user connected", ++userCount);
  ws.send("hello message from server");
});

server.listen(8080, () => {
  console.log(new Date() + ` Server is listening on port 8080`);
});
