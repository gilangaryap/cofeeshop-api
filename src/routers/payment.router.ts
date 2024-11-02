import { Router } from "express";
import { create, FetchAll, update } from "../handlers/transactions/payments.transactions";
import { authorization } from "../middleware/authorization.middleware";

export const paymentRouter = Router();

paymentRouter.post("/add",authorization(['admin']) , create);
paymentRouter.get("/", authorization(['admin']) ,FetchAll);
paymentRouter.patch("/setting/:id",authorization(['admin']) ,update)
