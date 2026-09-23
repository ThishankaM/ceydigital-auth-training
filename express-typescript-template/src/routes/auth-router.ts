import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { body, validationResult } from "express-validator";
import { ServerResponse } from "../shared/server-response";
import * as user_controller from "../controllers/user-controller";

const signupValidation = [
  body("email")
  .trim()
  .notEmpty().withMessage("Email is required")
  .isEmail().withMessage("Invalid email format")
  .isLength({ max: 255 }).withMessage("Email must be at most 255 characters long"),
  body("password")
  .trim()
  .notEmpty().withMessage("Password is required")
  .isLength({ min: 6, max: 100 }).withMessage("Password must be between 6 and 100 characters long"),
  body("name")
  .trim()
  .notEmpty().withMessage("Name is required")
  .isLength({ max: 255 }).withMessage("Name must be at most 255 characters long")
];

function toClientUser(user: any) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ")
    || user.username
    || user.email;
  return {
    id: String(user.id),
    name,
    email: user.email
  };
}

function validateSignup(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const fieldErrors: Record<string, string> = {};
    for (const error of errors.array()) {
      if(error.type === "field" && !fieldErrors[error.path]){
        fieldErrors[error.path] = error.msg;
      }
    }
    return res.status(400).send(
      new ServerResponse(false, { fieldErrors, data: errors.array() }, "Validation failed")
    );
  }
  next();
}
const auth_router = express.Router();

auth_router.post("/signup", signupValidation, validateSignup, user_controller.create);

auth_router.get("/verify", (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).send(
      new ServerResponse(false, { authenticated: false, user: null }, "Unauthorized")
    );
  }
  res.send(
    new ServerResponse(true, { authenticated: true, user: toClientUser(req.user) }, "Authenticated")
  );
});

auth_router.get("/me", (req, res) => {
  if (!req.isAuthenticated() || !req.user) {
    return res.status(401).send(new ServerResponse(false, null, "Unauthorized"));
  }
  res.send(new ServerResponse(true, toClientUser(req.user)));
});

export default auth_router;
