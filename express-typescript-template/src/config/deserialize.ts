// src/config/deserialize.ts (or wherever this file is)
import db from "./db";

export async function deserialize(id: any, done: (err: any, user?: any) => void) {
  try {
    const q = `SELECT id, full_name, email, date_created, date_updated FROM users WHERE id = $1`;
    const result = await db.query(q, [id]);

    if (result.rows.length === 0) {
      return done(null, false);
    }

    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
}