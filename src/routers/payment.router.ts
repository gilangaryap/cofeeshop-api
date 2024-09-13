import { Router } from "express";
import { create, FetchAll, update } from "../handlers/transactions/payments.transactions";

export const paymentRouter = Router();

paymentRouter.post("/add" , create);
paymentRouter.get("/", FetchAll);
paymentRouter.patch("/setting/:id",update)
