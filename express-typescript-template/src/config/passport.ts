import { PassportStatic } from "passport";
import { deserialize } from "./deserialize";
import LocalLogin from "./passport-strategies/passport-local";
import { serialize } from "./serialize";

export default function passportConfig(passport: PassportStatic) {
  // ── 1. Register the local strategy ──
  passport.use("local", LocalLogin);

  // ── 2. Use your project's serialize and deserialize handlers ──
  passport.serializeUser(serialize);
  passport.deserializeUser(deserialize);
}