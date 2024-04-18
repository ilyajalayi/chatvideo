const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let numUsers = 0; // تعداد افراد حاضر در روم

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

io.on("connection", (socket) => {
  console.log("A user connected");
  numUsers++;
  updateNumUsers();

  const userId = Math.random().toString(36).substr(2, 9);
  console.log("User ID:", userId);
  socket.emit("userId", userId);

  socket.on("stream", (stream) => {
    socket.broadcast.emit("stream", { userId, stream });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    numUsers--;
    updateNumUsers();
  });
});

const updateNumUsers = () => {
  io.emit("numUsers", numUsers); // ارسال تعداد افراد به تمام کاربران
};

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
