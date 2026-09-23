import GoogleStrategy from "passport-google-oauth20";
import db from "../db";

const clientId = process.env.GOOGLE_CLIENT_ID || "";
const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

/**
 * Passport strategy for authenticate with google
 * http://www.passportjs.org/packages/passport-google-oauth20/
 */
export default new GoogleStrategy.Strategy({
  clientID: clientId,
  clientSecret,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (async (accessToken, refreshToken, profile, cb) => {
  try {
    // This will create a user if no user exists for given google id
    // else this updates the users name, picture, date_updated etc and return
    const q = ``;

    // Create the data to pass to the query
    const body: any = profile;
    if (Array.isArray(profile.emails) && profile.emails.length) body.email = profile.emails[0].value;
    if (Array.isArray(profile.photos) && profile.photos.length) body.picture = profile.photos[0].value;

    const result = await db.query(q, [JSON.stringify(body)]);
    if (result.rows.length) {
      const [data] = result.rows;
      const user = data && data.user || null;
      if (user) {
        return cb(null, user);
      }
    }
    return cb(null);
  } catch (error: any) {
    return cb(error);
  }
}));
