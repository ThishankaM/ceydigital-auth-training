import db from "./db";

// Check whether the user is still exists on the database
export async function deserialize(id: string, done: any) {
  try {
    const q = ``;
    const result = await db.query(q, [id]);
    if (result.rows.length) {
      const [user] = result.rows;
      if (user)
        return done(null, user);
    }
    return done(null, null);
  } catch (error) {
    return done(error, null);
  }
}
