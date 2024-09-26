import { pool } from "../../common/database/database.service.js";

export async function selectTimeMainRender(req, res) {
  try {
    const result = await pool.query(
      `
        SELECT 
    selected.selected_id,
    workers.worker_id,  -- workers jadvalidagi worker_id
    workers.name AS worker_name,
    workers.phone_number AS worker_phone,
    times.start_time,
    times.end_time
    FROM 
    selected
    INNER JOIN 
    workers ON selected.worker_id = workers.id
    INNER JOIN 
    times ON selected.time_id = times.id;

        `
    );

    const users = result.rows;
    console.log(users);

    res.render("selecTimesAdmin/select_time_main", { layout: false, users });
  } catch (err) {
    res.send(err.message);
  }
}

export async function selectTimeDelete(req, res) {
  try {
    const { id } = req.params;
    await pool.query(`DELETE FROM selected WHERE selected_id = $1`, [id]);
    const result = await pool.query(
      `
        SELECT 
    selected.selected_id,
    workers.worker_id,  -- workers jadvalidagi worker_id
    workers.name AS worker_name,
    workers.phone_number AS worker_phone,
    times.start_time,
    times.end_time
    FROM 
    selected
    INNER JOIN 
    workers ON selected.worker_id = workers.id
    INNER JOIN 
    times ON selected.time_id = times.id;

        `
    );

    const users = result.rows;
    console.log(users);

    res.render("selecTimesAdmin/select_time_main", {
      layout: false,
      users,
    });
  } catch (err) {
    res.send(err.message);
  }
}

export async function selectTimeUpdateAll(req, res) {
  try {
    // DROP TABLE va CREATE TABLE so'rovlarini ajratish kerak
    await pool.query(`
      DROP TABLE IF EXISTS selected;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS selected(
        selected_id SERIAL PRIMARY KEY NOT NULL,
        worker_id INTEGER NOT NULL,
        time_id INTEGER NOT NULL,
        FOREIGN KEY (worker_id) REFERENCES workers(id),
        FOREIGN KEY (time_id) REFERENCES times(id)
      );
    `);

    // SELECT so'rovi
    const result1 = await pool.query(`
      SELECT 
        selected.selected_id,
        workers.id AS worker_id,  -- workers jadvalidagi worker_id
        workers.name AS worker_name,
        workers.phone_number AS worker_phone,
        times.start_time,
        times.end_time
      FROM 
        selected
      INNER JOIN 
        workers ON selected.worker_id = workers.id
      INNER JOIN 
        times ON selected.time_id = times.id;
    `);

    const users = result1.rows;
    console.log(users);

    res.render("selecTimesAdmin/select_time_main", {
      layout: false,
      users,
    });
  } catch (err) {
    res.send(err.message);
  }
}
