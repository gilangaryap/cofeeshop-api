import { Router } from "express";
import { create } from "../handlers/transactions/transactions.handler";

export const transactionsRouter = Router()

transactionsRouter.post("/add", create)