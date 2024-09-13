import { Router } from "express";
import { create, FetchAll, update } from "../handlers/transactions/status_transactions.handler";

export const status_transactionsRouter = Router();

status_transactionsRouter.post("/add", create);
status_transactionsRouter.get("/",FetchAll);
status_transactionsRouter.patch("/setting/:id",update);
