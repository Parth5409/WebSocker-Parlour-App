import express from "express";
import cors from "cors";
import helmet from "helmet";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./utils/database";
import { handleSocketConnection } from "./utils/socketHandler";

// Import routes
import authRoutes from "./routes/authRoutes";
import employeeRoutes from "./routes/employeeRoutes";
import taskRoutes from "./routes/taskRoutes";
import attendanceRoutes from "./routes/attendanceRoutes";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = createServer(app);
app.use(cookieParser())

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === "production" 
      ? ["https://parlour-management-app.vercel.app"] 
      : ["http://localhost:3000"],
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === "production" 
    ? ["https://parlour-management-app.vercel.app"] 
    : ["http://localhost:3000"],
  credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/attendance", attendanceRoutes);

// Health check endpoint
app.get("/api/health", (req: any, res: any) => {
  res.json({
    success: true,
    message: "Parlour Management API is running",
    timestamp: new Date().toISOString()
  });
});

// Handle 404 for API routes
app.use("/api/*", (req: any, res: any) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found"
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Global error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

// Handle Socket.IO connections
handleSocketConnection(io);

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Socket.IO server ready for real-time communications`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});

export default app;