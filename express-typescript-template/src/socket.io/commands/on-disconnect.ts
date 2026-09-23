import {Server, Socket} from "socket.io";
import db from "../../config/db";
import {log, log_error} from "../util";

export async function on_disconnect(io: Server, socket: Socket, reason?: string) {
  log(socket.id, `disconnected (${reason})`);
  try {
    const q = ``;
    const res = await db.query(q, []);
  } catch (error) {
    log_error(error);
  }
}
