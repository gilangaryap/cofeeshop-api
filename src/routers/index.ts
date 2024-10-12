import { Router } from "express";
import { authRouter } from "./auth.router";
import { profileRouter } from "./profile.router";
import { shippingRouter } from "./shipping.router";
import { paymentRouter } from "./payment.router";
import { status_transactionsRouter } from "./status_transactions.handler";
import { transactionsRouter } from "./transactions.router";
import { categoryRouter } from "./category.router";
import { productRouter } from "./product.router";
import { promoRouter } from "./promo.router";
import { testimonialRouter } from "./testimonial.router";


const mainRouter = Router();

    mainRouter.use("/user", authRouter);
    mainRouter.use("/profile", profileRouter);
    mainRouter.use("/shipping", shippingRouter);
    mainRouter.use("/payment", paymentRouter);
    mainRouter.use("/status", status_transactionsRouter);
    mainRouter.use("/transaction", transactionsRouter);
    mainRouter.use("/category", categoryRouter);
    mainRouter.use("/product", productRouter);
    mainRouter.use("/promo", promoRouter);
    mainRouter.use("/testimonial",testimonialRouter);
    
export default mainRouter;