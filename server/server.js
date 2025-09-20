import express from "express";
import "dotenv/config";
import cors from "cors"
import http from "http"
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io"

// Create express and http server
const app = express()
const server = http.createServer(app)


// Ye code Socket.IO server ka hai jo real-time features (jaise chat app me online users dekhna, live updates, notifications, etc.) ke liye use hota hai.

// Initialize socket.io server
export const io = new Server(server, {
  cors: { origin: "*" }
})

//Store online users
export const userSocketMap = {} // {userId , socketId}

//socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("User Connected", userId);

  if (userId) userSocketMap[userId] = socket.id;

  //Emit all users to connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user Disconnected ", userId)
    delete userSocketMap[userId]
    io.emit("getOnlineUsers", Object.keys(userSocketMap))
  })

})



// middleware setup
app.use(express.json({ limit: "20mb" }));
app.use(cors());

// Route Setup
app.use("/api/status", (req, res) => {
  res.send("server is live");
})
app.use("/api/auth", userRouter)
app.use("/api/message", messageRouter)

// connect to mongodb
await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000
  server.listen(PORT, () => {
    console.log(`server is running on PORT : ${PORT}`)
  })
}

//export server for vercel
export default server;

