import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "../db"; // Check your import path to db

export default new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, cb) => {
    try {
      // 1. Notice we SELECT password_hash (not password)
      const q = `SELECT id, full_name, email, password_hash,
                        date_created, date_updated
                 FROM users WHERE email = $1`;
      const result = await db.query(q, [email]);

      if (result.rows.length === 0) {
        return cb(null, false, { message: "Invalid email or password" });
      }

      const [user] = result.rows;

      // Safety check: ensure password_hash exists in the row
      if (!user.password_hash) {
        return cb(null, false, { message: "Invalid email or password" });
      }

      // 2. Compare with user.password_hash
      const isMatch = await bcrypt.compare(password, user.password_hash);

      if (!isMatch) {
        return cb(null, false, { message: "Invalid email or password" });
      }

      // Delete password hash so it is never stored in the session
      delete user.password_hash;
      return cb(null, user);

    } catch (error: any) {
      return cb(error);
    }
  }
);
