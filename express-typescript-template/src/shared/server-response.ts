export class ServerResponse<T> {
  public done: boolean;
  public body: T | null;
  public message: string | null;

  constructor(done: boolean, body: T, message: string | null = null) {
    this.done = !!done;
    this.body = body === null || body === undefined ? null : body;
    this.message = message && message.toString().trim();
  }
}
