import pkg from "pg";
import getConfig from "../config/config.service.js";
const { Pool } = pkg;
export const pool = new Pool({
  database: getConfig("DB_NAME"),
  user: getConfig("DB_USER"),
  host: getConfig("DB_HOST"),
  password: getConfig("DB_PASSWORD"),
  port: parseInt(getConfig("DB_PORT")),
});

async function connectToDb() {
  try {
    pool.connect();
    console.log("databasega ulandi");
  } catch (err) {
    console.log(err.message);
  }
}
export async function initDb() {
  try {
    await connectToDb();
    await createTbalse();
  } catch (err) {
    console.log(err.message);
  }
}

async function createTbalse() {
  try {
    await pool.query(
      `
            CREATE TABLE IF NOT EXISTS admin(
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                special_name VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL
                
            );
            `
    );
    await pool.query(
      `
      CREATE TABLE IF NOT EXISTS workers(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      phone_number VARCHAR(50),
      worker_id VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(255) NOT NULL
      );
      `
    );
    await pool.query(
      `
        CREATE TABLE IF NOT EXISTS times(
          id SERIAL PRIMARY KEY,
          start_time VARCHAR(20) NOT NULL,
          end_time VARCHAR(20) NOT NULL,
          total_slots VARCHAR(20) NOT NULL
        )
      `
    );
    await pool.query(
      `
 CREATE TABLE IF NOT EXISTS selected(
    selected_id SERIAL PRIMARY KEY NOT NULL,
    worker_id INTEGER NOT NULL,
    time_id INTEGER NOT NULL,
    FOREIGN KEY (worker_id) REFERENCES workers(id),
    FOREIGN KEY (time_id) REFERENCES times(id)
);

      
      `
    );
  } catch (err) {
    console.log(err.message);
  }
}
