import { Router } from "express";
import { FetchAll, login, register } from "../handlers/auth.handlers";
import { authorization } from "../middleware/authorization.middleware";

export const authRouter = Router();

authRouter.post("/login", login)
authRouter.post("/register", register)
authRouter.get("/", FetchAll)