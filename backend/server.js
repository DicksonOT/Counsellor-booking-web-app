import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import http from 'http';

import connectDB from './config/mongoDB.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import counsellorRouter from './routes/counsellorRoute.js';
import userRouter from './routes/userRoute.js';
import { initWebSocket } from './config/websocket.js'; 

// App config
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB & Cloudinary
connectDB();
connectCloudinary();

app.use(cors());
app.use(express.json({
  verify: (req, res, buf) => {
    if (req.originalUrl === '/api/user/stripe-webhook') {
      req.rawBody = buf.toString();
    }
  }
}));

// API routes
app.use('/api/admin', adminRouter);
app.use('/api/counsellor', counsellorRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => res.send('API working well'));

// ✅ Create HTTP server and pass to WebSocket
const server = http.createServer(app);
initWebSocket(server);

// Start server
server.listen(port, () => console.log(`Server running on port ${port}`));
