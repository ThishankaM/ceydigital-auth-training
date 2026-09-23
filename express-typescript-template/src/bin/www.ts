#!/usr/bin/env node

/**
 * Module dependencies.
 */

import dotenv from "dotenv";

dotenv.config();
global.Promise = require("bluebird");

import { Server, Socket } from "socket.io";
import app from "../app";
import { corsOptions } from "../config/cors";
import http from "http";
import { register } from "../socket.io";

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val?: string) {
  const p = parseInt(val || "0", 10);

  if (isNaN(p)) {
    // named pipe
    return val;
  }

  if (p >= 0) {
    // port number
    return p;
  }

  return false;
}

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT);
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);
const io = new Server(server, {
  cors: corsOptions(process.env.SOCKET_IO_CORS)
});

io.on("connection", (socket: Socket) => {
  register(io, socket);
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: any) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string"
    ? `Pipe ${port}`
    : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  if (!addr) return;
  const bind = typeof addr === "string"
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  console.log(`Listening on ${bind}`);
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
