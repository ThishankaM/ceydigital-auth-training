import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import db from "../db";

/**
 * Passport strategy for authenticate with username and password
 * http://www.passportjs.org/packages/passport-local/
 */
export default new LocalStrategy(
  { usernameField: "email", passwordField: "password" },
  async (email, password, cb) => {
    try {
      const q = `SELECT id, first_name, last_name, email, username, password,
                        date_created, date_updated
                 FROM users WHERE email = $1`;
      const result = await db.query(q, [email]);
      if (result.rows.length) {
        const [user] = result.rows;
        if (user && await bcrypt.compare(password, user.password)) {
          delete user.password;
          return cb(null, user);
        }
      }
      return cb(null, false);
    } catch (error: any) {
      return cb(error);
    }
  }
);
 