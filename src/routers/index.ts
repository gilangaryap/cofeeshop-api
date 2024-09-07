import { Router } from "express";
import { authRouter } from "./auth.router";


const mainRouter = Router();

    mainRouter.use("/user", authRouter);

export default mainRouter;