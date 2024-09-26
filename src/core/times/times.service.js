import { pool } from "../../common/database/database.service.js";

export async function timesGetRender(req, res) {
  try {
    const result = await pool.query("SELECT * FROM times");

    const users = result.rows;

    res.render("timeAdmin/time_main", { layout: false, users });
  } catch (err) {
    res.send(err.message);
  }
}
export async function timesAddRender(req, res) {
  try {
    res.render("timeAdmin/timeAdd", { layout: false });
  } catch (err) {
    res.send(err.message);
  }
}
export async function timeAdd(req, res) {
  try {
    const body = req.body;
    const result = await pool.query(
      `
      INSERT INTO times(start_time, end_time, total_slots)
      VALUES($1,$2,$3) RETURNING *
      `,
      [body.start_time, body.end_time, body.total_slots]
    );
    const result1 = await pool.query("SELECT * FROM times");

    const users = result1.rows;

    res.render("timeAdmin/time_main", { layout: false, users });
  } catch (err) {
    res.send(err.message);
  }
}
export async function timeDelete(req, res) {
  try {
    const { id } = req.params;
    const oldTimes = await pool.query("SELECT * FROM times WHERE id=$1", [id]);
    if (!oldTimes) {
      return res.send("xatolik yuz berdi");
    }
    const result = await pool.query(
      "DELETE FROM times WHERE id=$1 RETURNING *",
      [id]
    );
    const result1 = await pool.query("SELECT * FROM times");

    const users = result1.rows;

    res.render("timeAdmin/time_main", { layout: false, users });
  } catch (err) {
    res.send(err.message);
  }
}
