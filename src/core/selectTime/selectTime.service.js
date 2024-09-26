import { pool } from "../../common/database/database.service.js";

export async function selectTimeGetRender(req, res) {
  try {
    res.render("selecTimesAdmin/select_time_main", { layout: false });
  } catch (err) {
    res.send(err.message);
  }
}
export async function selectTimeAdd(req, res) {
  try {
    const { id } = req.params;
    const user = req.user;

    const oldUser = await pool.query(
      `
      SELECT * FROM selected WHERE worker_id = $1;
      `,
      [user.id]
    );
    if (oldUser.rows[0]) {
      return res.send(`Siz oz ish vaqtingizni tanlab bo'lgansiz `);
    }

    const selectedCount = await pool.query(
      "SELECT * FROM selected WHERE time_id=$1",
      [id] // id massivda bo'lishi kerak
    );

    const select_count = selectedCount.rows;
    const time = await pool.query(`SELECT * FROM times WHERE id=$1`, [id]);
    const time_slots = time.rows[0].total_slots;

    if (select_count.length >= time_slots) {
      return res.render("selectTImes/bandSelected", { layout: false });
    }

    // Tanlangan vaqtni olish
    const selected_time = await pool.query(
      `SELECT * FROM times WHERE id = $1`,
      [id]
    );

    if (!selected_time.rows[0]) {
      return res.send("Tanlangan vaqt mavjud emas");
    }

    // Tanlangan vaqtni qo'shish
    const result = await pool.query(
      `
      INSERT INTO selected (worker_id, time_id)
      VALUES ($1, $2) RETURNING *
      `,
      [user.id, selected_time.rows[0].id]
    );

    // Tanlangan vaqt ma'lumotlarini hbs faylga yuborish
    res.render("selectTImes/selected", {
      layout: false,
      timeStart: selected_time.rows[0].start_time,
      timeEnd: selected_time.rows[0].end_time,
    });
  } catch (err) {
    res.send(err.message);
  }
}

export async function boshSahifa(req, res) {
  try {
    res.send("bosh sahifa");
  } catch (err) {
    // Xatolik yuz berganda javob qaytarish
    res.status(500).render("error_page", {
      layout: false,
      message: "Serverda xatolik yuz berdi. Iltimos, keyinroq urinib ko'ring.",
    });
  }
}
