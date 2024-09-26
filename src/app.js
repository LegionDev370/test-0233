import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import bodyParser from "body-parser";
import { create } from "express-handlebars";
import getConfig from "./common/config/config.service.js";
import { initDb } from "./common/database/database.service.js";
import adminRouter from "./controller/admin.controlller.js";
import workerRouter from "./controller/workers.controller.js";
import timeRouter from "./controller/times.controller.js";
import selectTimeRouter from "./controller/selectTime.controller.js";
import userRouter from "./controller/user.controller.js";
import selectTimeAdminRouter from "./controller/selectTimeAdmin.controller.js";
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const hbs = create({
  extname: ".hbs",
  defaultLayout: "main",
});
async function init() {
  app.use(bodyParser.urlencoded({ extended: true }));

  app.engine("hbs", hbs.engine);
  app.set("view engine", ".hbs");
  app.set("views", path.join(__dirname, "views"));

  app.use("/admin/", adminRouter);
  app.use("/worker", workerRouter);
  app.use("/work-schedules", timeRouter);
  app.use("/select-schedule", selectTimeRouter);
  app.use("/selected-schedules-admin", selectTimeAdminRouter);

  app.use("/user", userRouter);
  const PORT = getConfig("EXPRESS_PORT");

  app.listen(PORT, console.log(`${PORT} port ishga tushdi`));
  initDb();
}
init();
