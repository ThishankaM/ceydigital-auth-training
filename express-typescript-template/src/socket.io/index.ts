import { Socket } from "socket.io";
import { on_disconnect } from "./commands/on-disconnect";
import { on_printer_connect } from "./commands/on-printer-connect";
import { SocketEvents } from "./events";
import { log } from "./util";

export function register(io: any, socket: Socket) {
  log(socket.id, "connected");
  socket.on(SocketEvents.printer_connect, (id) => on_printer_connect(io, socket, id));
  // socket.io built-in event
  socket.on("disconnect", (reason) => on_disconnect(io, socket, reason));
}
