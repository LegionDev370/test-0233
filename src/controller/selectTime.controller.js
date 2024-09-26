import { Router } from "express";
import {
  selectTimeGetRender,
  selectTimeAdd,
  boshSahifa,
} from "../core/selectTime/selectTime.service.js";
import { userLoginGuard } from "../common/middleware/guard/auth.guard.js";
import { selectTimeMainRender } from "../core/selectTimeAdmin/selectTimeAdmin.service.js";
const selectTimeRouter = Router();

selectTimeRouter.get("/", userLoginGuard, selectTimeGetRender);
selectTimeRouter.get("/:id", userLoginGuard, selectTimeAdd);

selectTimeRouter.get("/bosh-sahifa", boshSahifa);

export default selectTimeRouter;
