import { Router } from "express";
import { FetchAll, login, register, update } from "../handlers/auth/auth.handlers";

export const authRouter = Router();

authRouter.post("/login", login)
authRouter.post("/register", register)
authRouter.get("/", FetchAll)
authRouter.patch("/setting/:id", update)