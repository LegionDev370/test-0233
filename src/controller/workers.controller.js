import { Router } from "express";
const workerRouter = Router();
import {
  workerMainRender,
  workerAddRender,
  workerDeleteRender,
  workerUpdateRender,
  workerGetRender,
  workerAdd,
  workerDelete,
  workerUpdate,
  workerDeleteMain,
} from "../core/workers/worker.service.js";

workerRouter.get("/", workerMainRender);
workerRouter.get("/add", workerAddRender);
workerRouter.get("/delete", workerDeleteRender);
workerRouter.get("/update-password", workerUpdateRender);
workerRouter.get("/view", workerGetRender);
workerRouter.get("/deletea/:id", workerDeleteMain);

workerRouter.post("/add", workerAdd);
workerRouter.post("/delete", workerDelete);
workerRouter.post("/update-password", workerUpdate);

export default workerRouter;
