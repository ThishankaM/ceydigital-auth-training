import {PassportStatic} from "passport";

import { deserialize } from "./deserialize";
import LocalLogin from "./passport-strategies/passport-local";
import { serialize } from "./serialize";

/**
 * Use any passport middleware before the serialize and deserialize
 * @param {Passport} passport
 */
export default (passport: PassportStatic) => {
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
};
