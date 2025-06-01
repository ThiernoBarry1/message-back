require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const messageRoutes = require("./routes/messages");
const WebSocket = require("ws");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/messages", messageRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const wss = new WebSocket.Server({
  port: 3001,
});

wss.on("connection", (socket) => {
  console.log("Un client est connecté");

  socket.on("message", (message) => {
    console.log("Message reçu :", message);
    // resend to all clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  socket.send("Bienvenue dans le chat en temps réel !");
});
