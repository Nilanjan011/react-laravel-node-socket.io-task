const express = require('express');
const app = express();
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const port = 4001;
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    method: ['GET', 'POST']
  }
})

io.on("connection", (socket) => {
  console.log("connection socket");
  socket.on("delete", (data) => {
    console.log(data?.message);
    socket.emit("delete-server", { message: "delete response from server" })
  })
  socket.on("create", (data) => {
    console.log(data?.message);
    socket.emit("create-server", { message: "create response from server" })
  })
  socket.on("update", (data) => {
    console.log(data?.message);
    socket.emit("update-server", { message: "update response from server" })
  })
})

// app.get('/', (req, res) => {
//   res.json({ message: 'server response from server ' })
// })

server.listen(port, () => {
  console.log('server listening on port', port);
});

