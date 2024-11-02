import { Router } from "express";
import { create, FetchAll, update } from "../handlers/transactions/status_transactions.handler";
import { authorization } from "../middleware/authorization.middleware";

export const status_transactionsRouter = Router();

status_transactionsRouter.post("/add", create);
status_transactionsRouter.get("/",authorization(['admin']),FetchAll);
status_transactionsRouter.patch("/setting/:id",authorization(['admin']),update);
