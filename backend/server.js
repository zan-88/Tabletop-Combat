const express = require("express");
const cors = require("cors");
const http = require("http");
const dotenv = require("dotenv").config();
const { errorHandler } = require("./middleware/errorMiddleware");

const port = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

app.use("/api/tokens", require("./routes/tokenRoutes"));
app.use("/api/map", require("./routes/mapRoutes"));

app.use(errorHandler);

app.use(cors());

const server = http.createServer(app);

const { Server } = require("socket.io");

let dev = "http://localhost:3000";
let prod = "https://hasted-tables.netlify.app";

const io = new Server(server, {
  cors: {
    origin: [dev],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

//Runs when client connects
io.on("connection", (socket) => {
  console.log("New WS Connection...");

  socket.on("add-token-map", (sockTok) => {
    if (socket.connected) {
      socket.broadcast.emit("palce-token-map", sockTok);
    }
  });

  socket.on("token-change-pos", (newTok) => {
    if (socket.connected) {
      socket.broadcast.emit("change-token-map", newTok);
    }
  });

  socket.on("delete-token-map", (deleteKey) => {
    if (socket.connected) {
      socket.broadcast.emit("remove-token-map", deleteKey);
    }
  });
});

server.listen(port, () => console.log(`Server started on port ${port}`));
