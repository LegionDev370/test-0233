import { Router } from "express";
import {
  adminLogin,
  adminRegister,
  loginRender,
  registerRender,
} from "../core/admin/admin.service.js";
const adminRouter = Router();

adminRouter.get("/login", loginRender);
adminRouter.get("/register", registerRender);

adminRouter.post("/register", adminRegister);
adminRouter.post("/login", adminLogin);

export default adminRouter;
