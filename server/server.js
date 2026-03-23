const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const migrateRoutes = require("./routes/migrateRoutes");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use("/api/migrate", (req, res) => migrateRoutes(req, res, io));

server.listen(5000, () => {
    console.log("Server running on port 5000");
});