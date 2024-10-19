import { Router } from "express";
import { create, FetchAll ,FetchDetail } from "../handlers/transactions/transactions.handler";

export const transactionsRouter = Router()

transactionsRouter.post("/add", create)
transactionsRouter.get("/history-order/:id", FetchAll)
transactionsRouter.get("/detail-history/:uuid", FetchDetail)