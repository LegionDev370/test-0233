import getConfig from "../../common/config/config.service.js";
import { pool } from "../../common/database/database.service.js";
import { registerValidate, loginValidate } from "./admin.validate.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function registerRender(req, res) {
  try {
    res.render("admin/register", { layout: false });
  } catch (err) {
    res.send(err.message);
  }
}
export async function loginRender(req, res) {
  try {
    res.render("admin/login", { layout: false });
  } catch (err) {
    res.send(err.message);
  }
}

export async function adminRegister(req, res) {
  try {
    const body = req.body;
    const { error } = registerValidate.validate(body);
    const oldUser = await findBySpecial_name(body.name);
    if (oldUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    if (error) return res.status(400).send(error.details[0].message);
    const hashedPassword = await bcrypt.hash(body.password, 10);

    if (getConfig("MAXFIY_PASSWORD") != body.maxfiy_password) {
      return res.status(400).send("Invalid maxfiy password");
    }
    const result = await pool.query(
      `
            INSERT INTO admin(name, special_name, password) 
            VALUES($1, $2, $3) 
            RETURNING *
            `,
      [body.name, body.special_name, hashedPassword]
    );
    res.send(result.rows[0]);
  } catch (err) {
    res.send(err.message);
  }
}

export async function findBySpecial_name(name) {
  try {
    const result = await pool.query(
      `SELECT * FROM admin WHERE special_name=$1`,
      [name]
    );
    return result.rows[0];
  } catch (err) {
    console.log(err);
  }
}

export async function adminLogin(req, res) {
  try {
    const body = req.body;

    const { error } = loginValidate.validate(body);
    if (error) {
      const errorMessage =
        error.details && error.details[0]
          ? error.details[0].message
          : "Validation xatosi";
      return res.status(401).send(errorMessage);
    }

    const oldUser = await findBySpecial_name(body.special_name);

    if (!oldUser) {
      return res.status(401).send("Maxsus nom yoki parol xato");
    }

    const isValidPassword = await bcrypt.compare(
      body.password,
      oldUser.password
    );
    if (!isValidPassword) {
      return res.status(401).send("Maxsus nom yoki parol xato");
    }

    const accesToken = await createAccessToken(oldUser.special_name);

    res.cookie("accessToken", accesToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });
    res.render("admin/main_admin", { layout: false });
  } catch (err) {
    res.status(500).send(err.message || "Serverda xatolik yuz berdi");
  }
}

function createAccessToken(special_name) {
  return jwt.sign({ special_name }, getConfig("ACCES_SECRET"), {
    expiresIn: "1h",
  });
}
