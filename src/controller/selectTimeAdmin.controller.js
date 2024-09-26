import { Router } from "express";

import {
  selectTimeDelete,
  selectTimeMainRender,
  selectTimeUpdateAll,
} from "../core/selectTimeAdmin/selectTimeAdmin.service.js";
const selectTimeRouter = Router();

selectTimeRouter.get("/", selectTimeMainRender);
selectTimeRouter.get("/delete/:id", selectTimeDelete);
selectTimeRouter.get("/update-all", selectTimeUpdateAll);

export default selectTimeRouter;
