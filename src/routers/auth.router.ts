import { Router } from "express";
import { login, register } from "../handlers/auth.handlers";

export const authRouter = Router();

authRouter.post("/login", login)
authRouter.post("/register", register)
