import http from 'node:http';
import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { healthHandler } from './http/health.js';
import { attachWebSocketServer } from './ws/server.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

app.get('/health', healthHandler);

const server = http.createServer(app);
attachWebSocketServer(server);

server.listen(config.port, () => {
  console.log(`Backend listening on http://localhost:${config.port}`);
});
