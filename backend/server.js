const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', require('./routes/api'));

app.get('/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'DrishtiAI Backend Server',
    timestamp: new Date().toISOString(),
    version: '1.0.0-sih'
  });
});

const wss = new WebSocket.Server({ server, path: '/ws/telemed' });
const rooms = new Map();

wss.on('connection', (ws) => {
  let userRoom = null;
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      const { type, roomId, payload } = data;
      if (type === 'join') {
        userRoom = roomId;
        if (!rooms.has(roomId)) rooms.set(roomId, new Set());
        rooms.get(roomId).add(ws);
        ws.send(JSON.stringify({ type: 'joined', roomId }));
      } else if (roomId && rooms.has(roomId)) {
        rooms.get(roomId).forEach(client => {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ type, payload }));
          }
        });
      }
    } catch (err) {
      console.error('[WS Error]', err.message);
    }
  });

  ws.on('close', () => {
    if (userRoom && rooms.has(userRoom)) {
      rooms.get(userRoom).delete(ws);
      if (rooms.get(userRoom).size === 0) rooms.delete(userRoom);
    }
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`[DrishtiAI Backend] Server running on port ${PORT}`);
  console.log(`[DrishtiAI Telemed] WebSocket Signaling ready at ws://localhost:${PORT}/ws/telemed`);
});