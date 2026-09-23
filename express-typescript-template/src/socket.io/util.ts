/** [Socket IO] Log a socket io debug log */
export function log(id: string, value: any) {
  console.log(`[${id}] ${value}`);
}

/** [Socket IO] Log a socket io error */
export function log_error(error: any) {
  console.trace(`[SOCKET.IO]`, error);
}
