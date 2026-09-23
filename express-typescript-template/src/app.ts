import createError from "http-errors";
import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import session from "express-session";
import helmet from "helmet";
import compression from "compression";
import passport from "passport";
import cors from "cors";
import uglify from "uglify-js";

import { corsOptions } from "./config/cors";
import db from "./config/db";

import passportConfig from "./config/passport";
import indexRouter from "./routes/index";
import apiRouter from "./routes/api-router";
import authRouter from "./routes/auth-router";
import public_router from "./routes/public-router";

const app = express();

app.use(compression());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

app.use(cors(corsOptions()));

function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  return req.user ? next() : next(createError(401));
}

passportConfig(passport);

// eslint-disable-next-line @typescript-eslint/no-var-requires
require("pug").filters = {
  /**
   * ```pug
   * script
   *   :minify_js
   *     // JavaScript Syntax
   * ```
   * @param {String} text
   * @param {Object} options
   */
  minify_js(text: string) {
    if (!text) return;
    // return text;
    return uglify.minify({ "script.js": text }).code;
  }
};

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
// Can be enabled if needed
// app.use("/css", sassMiddleware({
//   src: path.join(__dirname, "scss"),
//   dest: path.join(__dirname, "public/css"),
//   outputStyle: "compressed",
//   indentedSyntax: false, // true = .sass and false = .scss
//   sourceMap: true
// }));

app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader("Content-Security-Policy", "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'");
  next();
});

if (process.env.NODE_ENV === "production") {
  app.get("*.js", (req, res, next) => {
    if (req.header("Accept-Encoding")?.includes("br")) {
      req.url = `${req.url}.br`;
      res.set("Content-Encoding", "br");
      res.set("Content-Type", "application/javascript; charset=UTF-8");
    } else if (req.header("Accept-Encoding")?.includes("gzip")) {
      req.url = `${req.url}.gz`;
      res.set("Content-Encoding", "gzip");
      res.set("Content-Type", "application/javascript; charset=UTF-8");
    }
    next();
  });
}

app.use(express.static(path.join(__dirname, "public")));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pgSession = require("connect-pg-simple")(session);
app.set("trust proxy", 1);
app.use(session({
  store: new pgSession({
    pool: db.pool,
    tableName: "pg_sessions"
  }),
  secret: process.env.SESSION_SECRET || [], // session secret
  cookie: {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    // secure: true,
    // domain: 'express-ts.com',
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
  },
  proxy: true,
  name: process.env.SESSION_NAME,
  resave: false,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/public", public_router);
app.use("/api/v1", isLoggedIn, apiRouter);
app.use("/", indexRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: { message: string; status: number; }, req: Request, res: Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
