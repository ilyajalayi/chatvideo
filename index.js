const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// استفاده از فایل‌های استاتیک برای فرانت‌اند (HTML، CSS، JS و ...)
app.use(express.static(path.join(__dirname, "public")));

// مسیر صفحه اصلی
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

// اتصال به سوکت‌ها
io.on("connection", (socket) => {
  console.log("A user connected");

  // دریافت و ارسال پیام‌های صوتی
  socket.on("voice", (data) => {
    socket.broadcast.emit("voice", data); // ارسال به تمام کاربران به جز خود کاربر
    // socket.emit("voice", data); // ارسال به خود کاربر
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// شنود بر روی درگاه 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
