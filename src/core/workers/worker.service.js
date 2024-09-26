import { workerAddValidate, workerUpdateValidate } from "./worker.validate.js";
import { pool } from "../../common/database/database.service.js";

export async function workerMainRender(req, res) {
  try {
    res.render("admin/workers/workers_main", { layout: false });
  } catch (err) {
    res.send(err.message);
  }
}
export async function workerAddRender(req, res) {
  try {
    res.render("admin/workers/workersAdd", { layout: false });
  } catch (err) {
    res.send(err.message);
  }
}
export async function workerDeleteRender(req, res) {
  try {
    res.render("admin/workers/workersDel", { layout: false });
  } catch (err) {
    res.send(err.message);
  }
}
export async function workerUpdateRender(req, res) {
  try {
    res.render("admin/workers/workersUpdate", { layout: false });
  } catch (err) {
    res.send(err.message);
  }
}

export async function workerGetRender(req, res) {
  try {
    const result = await pool.query("SELECT * FROM workers");
    const users = result.rows;
    res.render("admin/workers/workersGet", { layout: false, users });
  } catch (err) {
    res.send(err.message);
  }
}

export async function workerAdd(req, res) {
  try {
    const body = req.body;
    const { error } = workerAddValidate.validate(body);
    if (error) {
      return res.send(error.details[0].message);
    }
    const lastFiveDigits = body.phone_number.slice(-5);
    const reversedDigits = lastFiveDigits.split("").reverse().join("");
    const oldUser = await findByWorkerId(lastFiveDigits);
    if (oldUser) {
      return res.send("Bu nomerga tegishli xodim mavjud");
    }
    const result = await pool.query(
      `
        INSERT INTO workers (name,worker_id,phone_number, password,role)
        VALUES($1,$2,$3,$4,$5) RETURNING *
      `,
      [body.name, lastFiveDigits, body.phone_number, reversedDigits, body.role]
    );
    const result1 = await pool.query("SELECT * FROM workers");
    const users = result1.rows;
    res.render("admin/workers/workersGet", { layout: false, users });
  } catch (err) {
    res.send(err.message);
  }
}
export async function workerDelete(req, res) {
  try {
    const body = req.body;
    const oldUser = await findByWorkerId(body.worker_id);
    console.log(req.body.worker_id);

    if (!oldUser) {
      return res.send("ID ga tegishli xodim mavjud emas !");
    }
    const result = await pool.query(
      `
      DELETE FROM workers
      WHERE worker_id = $1
      RETURNING *;
      `,
      [body.worker_id]
    );
    res.send(result.rows[0]);
  } catch (err) {
    res.send(err.message);
  }
}

export async function workerUpdate(req, res) {
  try {
    const body = req.body;
    const { error } = workerUpdateValidate.validate(body);
    if (error) {
      return res.send(error.details[0].message);
    }
    const oldUser = await findByWorkerId(body.worker_id);
    if (!oldUser) {
      return res.send("ID ga tegishli xodim mavjud emas !");
    }
    const result = await pool.query(
      `
          UPDATE workers
          SET name = $1, password = $2, role = $3
          WHERE worker_id = $4
          RETURNING *
          `,
      [oldUser.name, body.new_password, oldUser.role, oldUser.worker_id]
    );
    res.send(result.rows[0]);
  } catch (err) {
    res.send(err.message);
  }
}

export async function findByWorkerId(id) {
  try {
    const worker = await pool.query(
      `SELECT * FROM workers WHERE worker_id = $1`,
      [id]
    );
    return worker.rows[0];
  } catch (err) {
    return err.message;
  }
}

export async function workerDeleteMain(req, res) {
  try {
    const { id } = req.params;

    // Xodimning mavjudligini tekshirish
    const oldWorker = await pool.query(`SELECT * FROM workers WHERE id=$1`, [
      id,
    ]);
    if (!oldWorker.rows[0]) {
      return res.send("ID ga tegishli xodim mavjud emas !");
    }

    // Tanlangan jadvaldagi yozuvlarni o'chirish
    await pool.query(`DELETE FROM selected WHERE worker_id = $1`, [id]);

    // Xodimni o'chirish
    await pool.query(`DELETE FROM workers WHERE id = $1`, [id]);

    // O'chirishdan so'ng sahifani qayta yuklash
    const result = await pool.query("SELECT * FROM workers");
    const users = result.rows;
    res.render("admin/workers/workersGet", { layout: false, users });
  } catch (err) {
    res.send(err.message);
  }
}
