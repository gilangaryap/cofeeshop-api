import { Router } from "express";
import { FetchAll, login, register, update } from "../handlers/auth/auth.handlers";
import { authorization } from "../middleware/authorization.middleware";

export const authRouter = Router();

authRouter.post("/login", login)
authRouter.post("/register", register)
authRouter.get("/", FetchAll)
authRouter.patch("/setting/:id", authorization(), update)