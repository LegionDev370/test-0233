import { pool } from "../../common/database/database.service.js";
import { userLoginValidate } from "./users.validate.js";
import jwt from "jsonwebtoken";
import getConfig from "../../common/config/config.service.js";
export async function userLoginRender(req, res) {
  try {
    res.render("users/userLogin", { layout: false });
  } catch (err) {
    res.send(err.message);
  }
}

export async function userLogin(req, res) {
  try {
    const body = req.body;

    // Tana tarkibidagi ma'lumotlarni tekshirish
    const { error } = userLoginValidate.validate(body);
    if (error) {
      const errorMessage =
        error.details && error.details[0]
          ? error.details[0].message
          : "Validation xatosi";
      return res.status(401).send(errorMessage);
    }

    // Foydalanuvchi mavjudligini tekshirish
    const oldUser = await findByUser_id(body.worker_id);

    if (!oldUser) {
      return res.status(401).send("ID yoki parol xato");
    }

    // Parolni tekshirish
    if (oldUser.password != body.password) {
      return res.send(`<h1>ID yoki parol xato </h1>`);
    }

    // Access token yaratish
    const accesToken = await createAccessToken(oldUser.worker_id);

    // Cookie'ga access tokenni joylash
    res.cookie("accessToken", accesToken, {
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    });

    // Barcha vaqtlarni olish
    const resultMain = await pool.query("SELECT * FROM times");
    const times = resultMain.rows;

    // Tanlangan vaqtlarni tekshirish
    const oldSelected = await pool.query(
      `SELECT * FROM selected WHERE worker_id = $1`,
      [oldUser.id]
    );

    // Agar foydalanuvchi avval vaqt tanlagan bo'lsa
    if (oldSelected.rows[0]) {
      const selected_time = await pool.query(
        `SELECT * FROM times WHERE id = $1`,
        [oldSelected.rows[0].time_id] // oldUser.id emas, oldSelected'dagi time_id ni oling
      );

      // Tanlangan vaqtning mavjudligini tekshirish
      if (selected_time.rows[0]) {
        return res.render("selectTImes/againSelected", {
          layout: false,
          timeStart:
            selected_time.rows[0]?.start_time || "Noma'lum start vaqti",
          timeEnd: selected_time.rows[0]?.end_time || "Noma'lum end vaqti",
        });
      }
    }

    // Foydalanuvchi asosiy sahifaga o'tkaziladi
    res.render("users/main_user", { layout: false, times });
  } catch (err) {
    res.status(500).send(err.message || "Serverda xatolik yuz berdi");
  }
}

export async function findByUser_id(id) {
  const result = await pool.query(
    `SELECT * FROM workers WHERE worker_id = $1`,
    [id]
  );
  return result.rows[0];
}

function createAccessToken(worker_id) {
  return jwt.sign({ worker_id }, getConfig("ACCES_SECRET"), {
    expiresIn: "1h",
  });
}
