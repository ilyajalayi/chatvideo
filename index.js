
// // شنود بر روی درگاه 3000
// const PORT = 3000;
// server.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const path = require("path");
//To holding users information 
const socketsStatus = {};


// استفاده از فایل‌های استاتیک برای فرانت‌اند (HTML، CSS، JS و ...)
app.use(express.static(path.join(__dirname, "public")));

// مسیر صفحه اصلی
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

io.on("connection", function (socket) {
  const socketId = socket.id;
  socketsStatus[socket.id] = {};


  console.log("connect");

  socket.on("voice", function (data) {

    var newData = data.split(";");
    newData[0] = "data:audio/ogg;";
    newData = newData[0] + newData[1];

    for (const id in socketsStatus) {

      if (id != socketId && !socketsStatus[id].mute && socketsStatus[id].online)
        socket.broadcast.to(id).emit("send", newData);
    }

  });

  socket.on("userInformation", function (data) {
    socketsStatus[socketId] = data;

    io.sockets.emit("usersUpdate",socketsStatus);
  });


  socket.on("disconnect", function () {
    delete socketsStatus[socketId];
  });

});

http.listen(3000, () => {
  console.log("the app is run in port 3000!");
});