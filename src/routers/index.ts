import { Router } from "express";
import { authRouter } from "./auth.router";
import { profileRouter } from "./profile.router";
import { shippingRouter } from "./shipping.router";
import { paymentRouter } from "./payment.router";


const mainRouter = Router();

    mainRouter.use("/user", authRouter);
    mainRouter.use("/profile", profileRouter);
    mainRouter.use("/shipping", shippingRouter);
    mainRouter.use("/payment", paymentRouter);

export default mainRouter;