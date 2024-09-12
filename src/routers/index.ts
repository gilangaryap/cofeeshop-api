import { Router } from "express";
import { authRouter } from "./auth.router";
import { profileRouter } from "./profile.router";
import { shippingRouter } from "./shipping.router";


const mainRouter = Router();

    mainRouter.use("/user", authRouter);
    mainRouter.use("/profile", profileRouter)
    mainRouter.use("/shipping", shippingRouter)

export default mainRouter;