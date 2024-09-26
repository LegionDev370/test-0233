import jwt from "jsonwebtoken";
import { pool } from "../../database/database.service.js";
import getConfig from "../../config/config.service.js";

export async function userLoginGuard(req, res, next) {
  try {
    const token = req.headers.cookie;
    if (!token) {
      return res.send("Not token");
    }
    const tokenSplit = token.split("=")[1];

    if (!tokenSplit) return res.status(401).send({ message: "Unauthorized" });

    const decoded = await accesTokenOpen(tokenSplit);
    const result = await findByUser_id(decoded);

    if (!result) return res.status(401).send({ message: "Unauthorized" });
    req.user = result;
    next();
  } catch (err) {
    res.send(err.message);
  }
}
export async function accesTokenOpen(token) {
  const result = jwt.verify(token, getConfig("ACCES_SECRET"));
  return result.worker_id;
}
export async function findByUser_id(id) {
  const result = await pool.query(
    `SELECT * FROM workers WHERE worker_id = $1`,
    [id]
  );
  return result.rows[0];
}
