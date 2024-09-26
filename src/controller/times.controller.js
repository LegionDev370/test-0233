import { Router } from "express";
import {
  timeAdd,
  timeDelete,
  timesAddRender,
  timesGetRender,
} from "../core/times/times.service.js";

const timeRouter = Router();

timeRouter.get("/", timesGetRender);
timeRouter.get("/add", timesAddRender);
timeRouter.get("/delete/:id", timeDelete);

timeRouter.post("/add", timeAdd);

export default timeRouter;
