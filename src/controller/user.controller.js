import { Router } from "express";
import { userLogin, userLoginRender } from "../core/users/users.service.js";
const userRouter = Router();

userRouter.get("/login", userLoginRender);
userRouter.get("/choose");

userRouter.post("/login", userLogin);

export default userRouter;
