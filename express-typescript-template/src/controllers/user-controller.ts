import { Request, Response } from "express";
import bcrypt from "bcrypt";
import db from "../config/db";
import { log_error } from "../shared/utils";
import { DEFAULT_ERROR_MESSAGE } from "../shared/constants";
import { DUPLICATE_KEY_VALUE } from "../shared/constants";
import { ServerResponse } from "../shared/server-response";

const SALT_ROUNDS = 10;

export async function create(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const q = `INSERT INTO users (full_name, email, password_hash)
               VALUES ($1, $2, $3)
               RETURNING id, full_name, email, date_created, date_updated`;
    const result = await db.query(q, [name, email || null, hashedPassword]);
    const [data] = result.rows;
    res.status(201).send({
      message: "Account created successfully",
      user: {
        id: String(data.id),
        name: data.full_name,
        email: data.email,
      },
      success: true,
      data,
    });
  } catch (error: any) {
    log_error(error);
    if (error.code === DUPLICATE_KEY_VALUE) {
      return res
        .status(409)
        .send({ message: "Email or username already exists" });
    }
    res
      .status(500)
      .send(new ServerResponse(false, null, DEFAULT_ERROR_MESSAGE));
  }
}

// ── GET USERS ──
export async function get(req: Request, res: Response) {
  try {
    const q = `SELECT id, full_name, email, date_created FROM users`;
    const result = await db.query(q, []);
    res.status(200).send(new ServerResponse(true, result.rows));
  } catch (error: any) {
    log_error(error);
    res
      .status(500)
      .send(new ServerResponse(false, null, DEFAULT_ERROR_MESSAGE));
  }
}

/*export async function update(req: Request, res: Response) {
  try {
    const q = ``;
    const result = await db.query(q, []);
    res.status(200).send(new ServerResponse(true, result.rows));
  } catch (error: any) {
    log_error(error);
    res.status(500).send(new ServerResponse(false, null, DEFAULT_ERROR_MESSAGE));
  }
}

export async function deleteById(req: Request, res: Response) {
  try {
    const q = ``;
    const result = await db.query(q, []);
    res.status(200).send(new ServerResponse(true, result.rows));
  } catch (error: any) {
    log_error(error);
    res.status(500).send(new ServerResponse(false, null, DEFAULT_ERROR_MESSAGE));
  }
}*/
