import { Router } from "express";
import { authRouter } from "./auth.router";
import { profileRouter } from "./profile.router";
import { shippingRouter } from "./shipping.router";
import { paymentRouter } from "./payment.router";
import { status_transactionsRouter } from "./status_transactions.handler";
import { transactionsRouter } from "./transactions.router";


const mainRouter = Router();

    mainRouter.use("/user", authRouter);
    mainRouter.use("/profile", profileRouter);
    mainRouter.use("/shipping", shippingRouter);
    mainRouter.use("/payment", paymentRouter);
    mainRouter.use("/status", status_transactionsRouter);
    mainRouter.use("/transsctions", transactionsRouter);
    
export default mainRouter;