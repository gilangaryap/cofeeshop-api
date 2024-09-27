import { Router } from "express";
import { create, FetchAll } from "../handlers/transactions/transactions.handler";

export const transactionsRouter = Router()

transactionsRouter.post("/add", create)
transactionsRouter.get("/history-order/:id", FetchAll)